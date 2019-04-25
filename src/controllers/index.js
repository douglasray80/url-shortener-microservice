import dns from 'dns'
import { Counter, Url } from '../models'

function getCountAndIncrement(req, res, callback) {
	Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, (err, data) => {
		if (err) return
		if (data) {
			callback(data.count)
		} else {
			const newCounter = new Counter()
			newCounter.save(err => {
				if (err) return
				Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, (err, data) => {
					if (err) return
					callback(data.count)
				})
			})
		}
	})
}

// find protocol and hostname
const protocolRegex = /^https?:\/\/(.*)/i

// find url patterns ex.'xxx.xxxxxx.xxxx'
const hostnameRegex = /^([a-z0-9\-_]+\.)+[a-z0-9\-_]+/i

export const saveUrl = (req, res) => {
	let url = req.body.url

	// "www.example.com/test/" and "www.example.com/test" are the same URL
	if (url.match(/\/$/i)) url = url.slice(0, -1)

	let protocolMatch = url.match(protocolRegex)
	if (!protocolMatch) {
		return res.json({ error: 'invalid URL' })
	}

	// remove the protocol (https?://), for dns lookup
	const hostAndQuery = protocolMatch[1]

	const hostnameMatch = hostAndQuery.match(hostnameRegex)
	if (hostnameMatch) {
		dns.lookup(hostnameMatch[0], err => {
			if (err) {
				res.json({ error: 'invalid Hostname' })
			} else {
				// Url is valid, check if it's already in the database
				Url.findOne({ url: url }, (err, storedUrl) => {
					if (err) return
					if (storedUrl) {
						// Url has been saved already, return the stored short_url
						res.json({ original_url: url, short_url: storedUrl.shortUrl })
					} else {
						// Increment the counter and save the url to db
						getCountAndIncrement(req, res, count => {
							const newUrlEntry = new Url({
								url: url,
								shortUrl: count
							})
							// return the stored data
							newUrlEntry.save(err => {
								if (err) return
								res.json({ original_url: url, short_url: count })
							})
						})
					}
				})
			}
		})
	} else {
		res.json({ error: 'invalid URL' })
	}
}

export const serveShortUrl = (req, res) => {
	const shortUrl = req.params.short_url
	if (!parseInt(shortUrl, 10)) {
		// The short_url parameter is not a number
		res.json({ error: 'Wrong Format' })
		return
	}
	Url.findOne({ shortUrl }, (err, data) => {
		if (err) return
		if (data) {
			// redirect to the actual url
			res.redirect(data.url)
		} else {
			res.json({ error: 'No short url found for given input' })
		}
	})
}
