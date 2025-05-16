import { useReducer, useCallback } from 'react'
import { UploadService } from '../services/upload-service'

type FileStatus = 'queued' | 'uploading' | 'completed' | 'failed'

export interface UploadFile {
  id: string
  file: File
  status: FileStatus
  progress: number
  retries: number
  error?: string
}

type UploadState = UploadFile[]

type UploadAction =
  | { type: 'ADD_FILES'; files: File[] }
  | { type: 'START_UPLOAD'; id: string }
  | { type: 'UPDATE_PROGRESS'; id: string; progress: number }
  | { type: 'COMPLETE_UPLOAD'; id: string }
  | { type: 'FAIL_UPLOAD'; id: string; error: string }
  | { type: 'RETRY_UPLOAD'; id: string }
  | { type: 'REMOVE_FILE'; id: string }

const uploadReducer = (
  state: UploadState,
  action: UploadAction
): UploadState => {
  switch (action.type) {
    case 'ADD_FILES':
      return [
        ...state,
        ...action.files.map((file) => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          status: 'queued' as const,
          progress: 0,
          retries: 0,
        })),
      ]

    case 'START_UPLOAD':
      return state.map((file) =>
        file.id === action.id ? { ...file, status: 'uploading' } : file
      )

    case 'UPDATE_PROGRESS':
      return state.map((file) =>
        file.id === action.id ? { ...file, progress: action.progress } : file
      )

    case 'COMPLETE_UPLOAD':
      return state.map((file) =>
        file.id === action.id
          ? { ...file, status: 'completed', progress: 100 }
          : file
      )

    case 'FAIL_UPLOAD':
      return state.map((file) =>
        file.id === action.id
          ? {
              ...file,
              status: 'failed',
              error: action.error,
              retries: file.retries + 1,
            }
          : file
      )

    case 'RETRY_UPLOAD':
      return state.map((file) =>
        file.id === action.id
          ? {
              ...file,
              status: 'queued',
              error: undefined,
            }
          : file
      )

    case 'REMOVE_FILE':
      return state.filter((file) => file.id !== action.id)

    default:
      return state
  }
}

export const useUploadManager = () => {
  const [files, dispatch] = useReducer(uploadReducer, [])
  const MAX_CONCURRENT = 3
  const MAX_RETRIES = 2

  const processUpload = useCallback(async (file: UploadFile) => {
    try {
      dispatch({ type: 'START_UPLOAD', id: file.id })

      const { url, fields } = await UploadService.getPresignedUrl(file.file)
      await UploadService.uploadToS3(url, fields, file.file, (progress) => {
        dispatch({ type: 'UPDATE_PROGRESS', id: file.id, progress })
      })

      dispatch({ type: 'COMPLETE_UPLOAD', id: file.id })
    } catch (error) {
      dispatch({
        type: 'FAIL_UPLOAD',
        id: file.id,
        error: error instanceof Error ? error.message : String(error),
      })
      if (file.retries < MAX_RETRIES) {
        setTimeout(() => dispatch({ type: 'RETRY_UPLOAD', id: file.id }), 2000)
      }
    }
  }, [])

  return { files, dispatch, processUpload, MAX_CONCURRENT }
}
