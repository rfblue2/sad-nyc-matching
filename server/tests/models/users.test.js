import mongoose from 'mongoose'
import Users from '../../models/users'

describe('Users', () => {

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
      if (err) process.exit(1)
    })
  })

  afterAll(async done => {
    await mongoose.connection.close()
    done()
  })

  it('should create and save a user', async () => {
    const user = new Users({
      name: 'testuser'
    })
    const savedUser = await user.save()
    expect(savedUser._id).toBeDefined()
    expect(savedUser.name).toBe('testuser')
  })

})
