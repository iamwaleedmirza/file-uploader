import { Schema, model, Document } from 'mongoose'

interface UploadDocument extends Document {
  filename: string
  s3Key: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
}

const schema = new Schema<UploadDocument>(
  {
    filename: { type: String, required: true },
    s3Key: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

export const UploadModel = model<UploadDocument>('Upload', schema)
