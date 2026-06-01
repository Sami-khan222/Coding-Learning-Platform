import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  language:    { type: String, enum: ['python', 'javascript', 'java', 'cpp'] },
  quizScore:   { type: Number, default: 0 },
  certified:   { type: Boolean, default: false },
  completedAt: { type: Date },
}, { _id: false })

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true, maxlength: 80 },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  progress:     { type: [progressSchema], default: [] },
}, { timestamps: true })

// Never return passwordHash in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.passwordHash
  return obj
}

export default mongoose.model('User', userSchema)
