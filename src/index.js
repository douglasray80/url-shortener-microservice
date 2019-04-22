import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import dns from 'dns'

import { Counter, Url } from './models'
import { isUrl } from './utils'

const app = express()
app.use(cors({ optionSuccessStatus: 200 })) // some legacy browsers choke on 204

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/', (req, res) => res.sendFile(__dirname + 'index.html'))

app.post('/api/shorturl/new', (req, res) => {
	const { url } = req.body

	// validate url
	if (!isUrl(url)) {
		console.log('Invalid Url')
		return res.json({ error: 'Invalid URL' })
	}
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
})

app.get('/api/shorturl/:short_url', (req, res) => {
	const { short_url } = req.params

	console.log(short_url)
	// 3. When I visit the shortened URL, it will
	// redirect me to my original link.
})

mongoose.connect(
	process.env.MONGO_URI,
	{
		useNewUrlParser: true,
		useCreateIndex: true
	},
	(err, db) => {
		if (err) {
			console.log('Database error: ' + err)
		} else {
			console.log('Successful database connection')

			app.listen(process.env.PORT || 4000, () => {
				console.log('Your app is listening on port 4000')
			})
		}
	}
)
