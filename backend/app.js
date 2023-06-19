// 👇 dependencies ∴∵
import express from 'express'

// 👇 imports ∴∵
import config from './config/index.js'
import loader from './loaders/index.js'

async function startServer() {
  const app = express()

  await loader(app)

  app.listen(config.port, () => {
    console.log('success')
  }).on('error', error => {
    process.exit(1)
  })
}

startServer()