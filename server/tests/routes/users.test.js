import mongoose from 'mongoose'
import User from '../../models/users'
import supertest from 'supertest'
import createApp from '../../app'

describe('Users', () => {
  let server = null
  let request = null

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
      if (err) process.exit(1)
    })
  })

  afterAll(async done => {
    await mongoose.connection.close()
    done()
  })

  beforeEach(() => {
    server = createApp(global.__MONGO_URI__).listen()
    request = supertest.agent(server)
  })

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
    await server.close()
  })

  it('should post a user', async () => {
    const res = await request
      .post('/api/users')
      .send({ name: 'testuser' })
    expect(res.statusCode).toEqual(201)
    expect(res.body._id).toBeDefined()
    expect(res.body.name).toBe('testuser')

    const storedUser = await User.findById(res.body._id)
    expect(storedUser.name).toBe('testuser')
  })

  it('should get a list of users', async () => {
    await (new User({name: 'testuser1'})).save()
    await (new User({name: 'testuser2'})).save()

    const res = await request
      .get('/api/users')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveLength(2)
    expect(res.body[0].name).toBe('testuser1')
    expect(res.body[1].name).toBe('testuser2')
  })

  it('should get a user by id', async () => {
    const user1 = await (new User({name: 'testuser1'})).save()
    await (new User({name: 'testuser2'})).save()

    const res = await request
      .get(`/api/users/${user1._id}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.name).toBe('testuser1')
  })
})
