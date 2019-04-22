import dns from 'dns'

import { Counter, Url } from '../models'
import { isUrl } from '../utils'

const incrementCount = (req, res, cb) => {
	Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, (err, data) => {
		if (err) return null
		if (data) {
			cb(data.count)
		} else {
			const newCounter = new Counter()
			newCounter.save(err => {
				if (err) return null
				Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, (err, data) => {
					if (err) return null
					cb(data.count)
				})
			})
		}
	})
}

export const saveUrl = (req, res, next) => {
	const { url } = req.body

	// validate url
	if (!isUrl(url)) {
		console.log('Invalid Url')
		return res.json({ error: 'Invalid URL' })
	}

	// dns.lookup(url, err => {
	// 	if (err) {
	// 		// no DNS match, invalid Hostname, the URL won't be stored
	// 		return res.json({ error: 'invalid Hostname' })
	// 	} else {
	// 		console.log('url is valid')
	// 	}
	// })

	console.log(url)
	// 1. I can POST a URL to `[project_url]/api/shorturl/new`
	// and I will receive a shortened URL in the JSON response.
	// Example : `{"original_url":"www.google.com","short_url":1}`

	// 2. If I pass an invalid URL that doesn't follow the valid
	// `http(s)://www.example.com(/more/routes)` format, the
	// JSON response will contain an error like `{"error":"invalid URL"}`.
	// _HINT_: to be sure that the submitted url points to a valid site
	// you can use the function `dns.lookup(host, cb)` from the `dns` core module.
	res.json({ original_url: '', short_url: '' })
}

export const serveShortUrl = (req, res, next) => {
	const { short_url } = req.params

	console.log(short_url)
	// 3. When I visit the shortened URL, it will
	// redirect me to my original link.
}
