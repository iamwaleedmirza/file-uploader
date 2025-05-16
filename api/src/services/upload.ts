import { UploadModel } from '../models/upload'
import { DatabaseError } from '../middlewares/error'

export const createUploadRecord = async (filename: string, s3Key: string) => {
  try {
    return await UploadModel.create({ filename, s3Key })
  } catch (error: any) {
    console.error('Database Error in createUploadRecord:', error)
    throw new DatabaseError(
      `Failed to create upload record: ${
        error.message || 'Unknown database error'
      }`
    )
  }
}

export const updateUploadStatus = async (
  s3Key: string,
  status: 'completed' | 'failed'
) => {
  try {
    const update = await UploadModel.findOneAndUpdate(
      { s3Key },
      { status },
      { new: true }
    )

    if (!update) {
      throw new DatabaseError(`Upload record with key ${s3Key} not found`)
    }

    return update
  } catch (error: any) {
    console.error('Database Error in updateUploadStatus:', error)
    throw new DatabaseError(
      `Failed to update upload status: ${
        error.message || 'Unknown database error'
      }`
    )
  }
}
