import mongoose from 'mongoose'

const urlSchema = new mongoose.Schema({
	url: { type: String, required: true },
	shortUrl: { type: Number, required: true, unique: true }
})

export default mongoose.model('Url', urlSchema)
