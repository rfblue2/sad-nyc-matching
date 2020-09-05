import express from 'express'
import Users from '../models/users'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import fetch from 'isomorphic-fetch'
const router = express.Router()

const FB_APP_ID = '269610851097558'
const FB_APP_SECRET = process.env.FB_APP_SECRET

const authenticate = expressJwt({
  secret: process.env.JWT_SECRET,
  requestProperty: 'auth',
  getToken: (req) => {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token']
    }
    return null
  }
})

const getUser = async (req, res, next) => {
  req.q = Users.findById(req.auth.id)
  req.user = await req.q.exec()
  if (!req.user) res.status(401).end()
  else next()
}

const requireAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.status(401).end()
  } else {
    next()
  }
}

router.route('/')
  .get(authenticate, getUser, requireAdmin, async (req, res) => {
    const users = await Users.find()
    res.status(200).json(users)
  })
  .post(authenticate, getUser, requireAdmin, async (req, res) => {
    const user = new Users({ ...req.body })
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  })

const verifyFbToken = async (token, userId) => {
  if (!token || token === 'undefined' || !userId || userId === 'undefined') return false
  const url = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${FB_APP_ID}|${FB_APP_SECRET}`
  const tokenRes = await fetch(url)
  const tokenJson = await tokenRes.json()
  return tokenJson.data.user_id === userId
}

const fetchLongAccessToken = async (token) => {
  const longLivedTokenRes = await fetch(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchagne_token&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&fb_exchange_token=${token}`)
  const longLivedTokenJson = await longLivedTokenRes.json()
  return longLivedTokenJson.access_token
}

router.route('/login')

  // login with facebook credentials
  .post(async (req, res) => {
    const {fbAccessToken, fbUserId, email, name} = req.body
    if (fbAccessToken && fbUserId) {
      const verifyRes = await verifyFbToken(fbAccessToken, fbUserId)
      if (!verifyRes) {
        res.status(401).end()
        return
      }

      const longLivedToken = await fetchLongAccessToken(fbAccessToken)

      let user = await Users.findOne({'facebookProvider.id': fbUserId})
      let savedUser = null
      if (!user) {
        // User with facebook id does not exist - so must be a new user
        user = new Users({
          name,
          email,
          facebookProvider: {
            token: longLivedToken,
            id: fbUserId,
          }
        })
        savedUser = await user.save()
      } else {
        // existing user - update their FB long lived token
        user.facebookProvider.longLivedToken = longLivedToken
        savedUser = await user.save()
      }

      const auth = {
        id: savedUser._id, facebook_id: fbUserId, email, name
      }
      const token = jwt.sign(auth, process.env.JWT_SECRET, { expiresIn: 2 * 3600 })
      
      res.setHeader('x-auth-token', token)
      res.status(200).send(auth)
    } else {
      res.status(401).send()
    }
  })

// returns the logged in user based on auth token
router.route('/me')
  .get(authenticate, getUser, async (req, res) => {
    res.status(200).json(req.user)
  })

router.route('/:id')
  .get(authenticate, getUser, requireAdmin, async (req, res) => {
    const user = await Users.findById(req.params.id)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).send()
    }
  })

export default router
