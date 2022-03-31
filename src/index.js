import express from 'express'
import morgan from 'morgan'
import path from 'path'
import cors from 'cors'
import { connectDB } from '#database/mongodb.js'
import routeV1 from './routes/v1/index.js'

const app = express()

const port = process.env.APP_PORT || 5000

const host = process.env.APP_HOST || '0.0.0.0'

// Use cors
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

// Console log requests
app.use(morgan('combined'))

// Parse
app.use(express.json()) //x-form-www
app.use(express.urlencoded({ extended: true })) //json

// Static dir
app.use(express.static(path.join(path.resolve(), 'src/public')))

// Init app
connectDB().then(() => {
  // Route init
  app.use('/api/v1', routeV1)

  // App listen
  app.listen(port, () => {
    console.log(`App listening at http://${host}:${port}`)
  })
})

export default app
