import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'

import { saveUrl, serveShortUrl } from './controllers'

const app = express()
app.use(cors({ optionSuccessStatus: 200 }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/', (req, res) => res.sendFile(__dirname + 'index.html'))

app.post('/api/shorturl/new', saveUrl)

// app.get('/api/shorturl/:short_url', serveShortUrl)

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
