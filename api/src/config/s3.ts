import { S3Client } from '@aws-sdk/client-s3'
import { config } from './env'

export const s3Client = new S3Client({
  region: config.AWS.REGION,
  credentials: {
    accessKeyId: config.AWS.ACCESS_KEY,
    secretAccessKey: config.AWS.SECRET_KEY,
  },
})
