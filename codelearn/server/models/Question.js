import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['python', 'javascript', 'java', 'cpp'],
    index: true,
  },
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: arr => arr.length === 4,
      message: 'Each question must have exactly 4 options',
    },
  },
  correctIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
}, { timestamps: true })

export default mongoose.model('Question', questionSchema)
