const dns = require('dns')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({ optionSuccessStatus: 200 })) // some legacy browsers choke on 204

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + 'index.html')
})

app.post('/api/shorturl/new', (req, res) => {
	console.log(req.body)
	// 1. I can POST a URL to `[project_url]/api/shorturl/new`
	// and I will receive a shortened URL in the JSON response.
	// Example : `{"original_url":"www.google.com","short_url":1}`

	// 2. If I pass an invalid URL that doesn't follow the valid
	// `http(s)://www.example.com(/more/routes)` format, the
	// JSON response will contain an error like `{"error":"invalid URL"}`.
	// _HINT_: to be sure that the submitted url points to a valid site
	// you can use the function `dns.lookup(host, cb)` from the `dns` core module.

	// 3. When I visit the shortened URL, it will
	// redirect me to my original link.
	res.json({ original_url: '', short_url: '' })
})

const listener = app.listen(process.env.PORT || 4000, () => {
	console.log('Your app is listening on port ' + listener.address().port)
})
