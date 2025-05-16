import express from 'express'
import cors from 'cors'
import { uploadRouter } from './routes/upload'
import { errorHandler } from './middlewares/error'
import { config } from './config/env'

const app = express()

// Middleware
app.use(cors()) // Uncommented this line
app.use(express.json())

// Routes
app.use('/api/upload', uploadRouter)
app.use('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
  })
})

// Error handling - must be registered without a path parameter
app.use(errorHandler as express.ErrorRequestHandler)

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
