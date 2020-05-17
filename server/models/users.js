import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  role: String, // admin or user
  facebookProvider: {
    type: {
      id: String,
      token: String,
    },
    transform: () => undefined // do not deserialize these fields
  },
})

export default mongoose.model('User', UserSchema)