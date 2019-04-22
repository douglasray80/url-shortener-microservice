import mongoose from 'mongoose'

const counterSchema = new mongoose.Schema({
	count: { type: Number }
})

export default mongoose.model('Counter', counterSchema)
