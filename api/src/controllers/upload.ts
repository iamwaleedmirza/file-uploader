import { RequestHandler } from 'express'
import { generatePresignedPost } from '../services/s3'
import { createUploadRecord } from '../services/upload'

interface ValidationError {
  field: string
  message: string
}

export const generatePresignedUrl: RequestHandler = async (req, res, next) => {
  try {
    const { filename, contentType } = req.body
    const errors: ValidationError[] = []

    // Validate required fields with specific error messages
    if (!filename) {
      errors.push({ field: 'filename', message: 'Filename is required' })
    }

    if (!contentType) {
      errors.push({ field: 'contentType', message: 'Content type is required' })
    }

    // Return all validation errors at once
    if (errors.length > 0) {
      res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        errors,
        message: 'Validation failed. Please check your input.',
      })
      return
    }

    // Validate file format if needed
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'text/plain',
    ]
    if (!allowedTypes.includes(contentType)) {
      res.status(400).json({
        status: 'error',
        code: 'UNSUPPORTED_FILE_TYPE',
        message: `File type "${contentType}" is not supported. Allowed types: ${allowedTypes.join(
          ', '
        )}`,
      })
      return
    }

    try {
      const presignedData = await generatePresignedPost(filename, contentType)
      await createUploadRecord(filename, presignedData.key)
      res.json({
        status: 'success',
        data: {
          url: presignedData.url,
          fields: presignedData.fields,
        },
      })
    } catch (serviceError: any) {
      // Handle S3 service errors specifically
      if (serviceError.name === 'S3ServiceError') {
        res.status(502).json({
          status: 'error',
          code: 'S3_SERVICE_ERROR',
          message:
            'Unable to generate upload URL. Storage service is unavailable.',
        })
        return
      }

      // Handle permission errors (403 Forbidden)
      if (
        serviceError.statusCode === 403 ||
        serviceError.code === 'Forbidden'
      ) {
        res.status(403).json({
          status: 'error',
          code: 'S3_PERMISSION_DENIED',
          message: 'Permission denied when accessing storage service.',
        })
        return
      }

      // Handle S3 errors with other status codes
      if (serviceError.statusCode || serviceError.code) {
        const statusCode = serviceError.statusCode || 500
        res.status(statusCode).json({
          status: 'error',
          code: 'S3_ERROR',
          message:
            serviceError.message || 'Error occurred with storage service',
          details: {
            code: serviceError.code,
            requestId: serviceError.requestId,
          },
        })
        return
      }

      // Handle database errors specifically
      if (serviceError.name === 'DatabaseError') {
        res.status(500).json({
          status: 'error',
          code: 'DATABASE_ERROR',
          message: 'Failed to record upload information.',
        })
        return
      }

      // Pass other errors to the global error handler
      throw serviceError
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Unhandled error in generatePresignedUrl:', error)

    // Ensure we always return a proper response even for unexpected errors
    if (!res.headersSent) {
      res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while processing your request',
      })
      return
    }

    next(error)
  }
}
