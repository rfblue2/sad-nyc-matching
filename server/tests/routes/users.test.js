import mongoose from 'mongoose'
import User from '../../models/users'
import supertest from 'supertest'
import createApp from '../../app'
import jwt from 'jsonwebtoken'

describe('Users', () => {
  let server = null
  let request = null
  let adminToken = null

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
      if (err) process.exit(1)
    })
  })

  afterAll(async done => {
    await mongoose.connection.close()
    done()
  })

  beforeEach(async () => {
    server = createApp(global.__MONGO_URI__).listen()
    request = supertest.agent(server)
    const adminUser = new User({name: 'admin', role: 'admin'})
    const admin = await adminUser.save()
    adminToken = jwt.sign({id: admin._id, facebook_id: '', email: '', name: 'admin'}, process.env.JWT_SECRET)
  })

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
    await server.close()
  })

  it('should post a user', async () => {
    const res = await request
      .post('/api/users')
      .set('x-auth-token', adminToken)
      .send({ name: 'testuser' })
    expect(res.statusCode).toEqual(201)
    expect(res.body._id).toBeDefined()
    expect(res.body.name).toBe('testuser')

    const storedUser = await User.findById(res.body._id)
    expect(storedUser.name).toBe('testuser')
  })

  it('should fail to post a user without admin creds', async () => {
    const user = await (new User({name: 'testuser'})).save()
    const res = await request
      .post('/api/users')
      .set('x-auth-token', jwt.sign({id: user._id, name: 'user'}, process.env.JWT_SECRET))
      .send({ name: 'other testuser' })
    expect(res.statusCode).toEqual(401)

    const userRes = await User.find({name: 'other testuser'})
    expect(userRes).toHaveLength(0)
  })

  it('should get a list of users', async () => {
    await (new User({name: 'testuser1'})).save()
    await (new User({name: 'testuser2'})).save()

    const res = await request
      .get('/api/users')
      .set('x-auth-token', adminToken)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveLength(3)
    expect(res.body[0].name).toBe('admin')
    expect(res.body[1].name).toBe('testuser1')
    expect(res.body[2].name).toBe('testuser2')
  })

  it('should fail to get a list of users without admin creds', async () => {
    const user = await (new User({name: 'testuser'})).save()
    const res = await request
      .get('/api/users')
      .set('x-auth-token', jwt.sign({id: user._id, name: 'user'}, process.env.JWT_SECRET))
    expect(res.statusCode).toEqual(401)
  })

  it('should get a user by id', async () => {
    const user1 = await (new User({name: 'testuser1'})).save()
    await (new User({name: 'testuser2'})).save()

    const res = await request
      .get(`/api/users/${user1._id}`)
      .set('x-auth-token', adminToken)
    expect(res.statusCode).toEqual(200)
    expect(res.body.name).toBe('testuser1')
  })

  it('should fail to get a user by id without admin creds', async () => {
    const user = await (new User({name: 'testuser'})).save()
    const res = await request
      .get(`/api/users/${user._id}`)
      .set('x-auth-token', jwt.sign({id: user._id, name: 'user'}, process.env.JWT_SECRET))
    expect(res.statusCode).toEqual(401)
  })
})
