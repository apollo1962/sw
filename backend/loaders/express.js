// 👇 dependencies ∴∵
import express from 'express'
import cors from 'cors'
import { OpticMiddleware } from '@useoptic/express-middleware'

// 👇 imports ∴∵
import config from '../config/index.js'
import { path, __dirname, __filename } from '../utils/paths.js'

export default (app) => {

  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname, 'client/views'))

  app.enable('trust proxy')

  app.use(cors())
  app.use(express.json())

  app.use('/dist', express.static(path.join(__dirname, 'client/dist')))
  app.use('/public', express.static(path.join(__dirname, 'client/public')))

  app.get('/', (request, response) => {
    response.render('app', {
      title: 'App'
    })
  })

  app.use(OpticMiddleware({
    enabled: process.env.NODE_ENV !== 'production'
  }))

  app.use((request, response, next) => {
    const error = new Error('Not Found')
    error['status'] = 404

    next(error)
  })

  app.use((error, request, response, next) => {
    if (error.name === 'UnauthorizedError') {
      return response.status(error.status).send({message: error.message}).end()
    }
    return next(error)
  })

  app.use((error, request, response, next) => {
    response.status(error.status || 500)
    response.json({
      errors: {
        message: error.message,
      },
    })
  })

}