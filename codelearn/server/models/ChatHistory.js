import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false })

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  language: {
    type: String,
    enum: ['python', 'javascript', 'java', 'cpp', 'general'],
    default: 'general',
  },
  messages: {
    type: [messageSchema],
    default: [],
  },
}, { timestamps: true })

export default mongoose.model('ChatHistory', chatHistorySchema)
