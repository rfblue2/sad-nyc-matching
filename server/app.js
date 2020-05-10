import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import mongoose from 'mongoose'

import usersRouter from './routes/users'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../client/build')))

// Setup DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sadnyc', 
  {
    'useNewUrlParser': true,
    'useUnifiedTopology': true,
  }
)

app.use('/api/users', usersRouter)
app.get('/healthcheck', (req, res) => {
  res.send('ok')
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

module.exports = app