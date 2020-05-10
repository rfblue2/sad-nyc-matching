import express from 'express'
import Users from '../models/users'
const router = express.Router()

router.route('/')
  .get(async (req, res) => {
    const users = await Users.find()
    res.status(200).json(users)
  })
  .post(async (req, res) => {
    const user = new Users({ ...req.body })
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  })

router.route('/:id')
  .get(async (req, res) => {
    const user = await Users.findById(req.params.id)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).send()
    }
  })

export default router
