const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors({ optionSuccessStatus: 200 })) // some legacy browsers choke on 204

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + 'index.html')
})

const listener = app.listen(process.env.PORT || 4000, () => {
	console.log('Your app is listening on port ' + listener.address().port)
})
