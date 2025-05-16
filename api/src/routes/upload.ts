import { Router } from 'express'
import { generatePresignedUrl } from '../controllers/upload'

export const uploadRouter = Router()

uploadRouter.post('/presigned', generatePresignedUrl)
