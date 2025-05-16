import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { s3Client } from '../config/s3'
import { config } from '../config/env'
import { S3ServiceError } from '../middlewares/error'
import crypto from 'crypto'

export const generatePresignedPost = async (
  filename: string,
  contentType: string
) => {
  try {
    const uuid = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
    const key = `uploads/${uuid}_${filename}`

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: config.AWS.BUCKET,
      Key: key,
      Conditions: [
        ['starts-with', '$Content-Type', contentType],
        ['content-length-range', 0, 10_000_000], // 10MB
      ],
      Expires: 3600,
    })

    return { url, fields, key }
  } catch (error: any) {
    console.error('S3 Service Error:', error)
    throw new S3ServiceError(
      `Failed to generate presigned URL: ${
        error.message || 'Unknown S3 service error'
      }`
    )
  }
}
