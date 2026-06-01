import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['python', 'javascript', 'java', 'cpp'],
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Certificate', certificateSchema)
