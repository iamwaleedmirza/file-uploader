import { useCallback, useEffect } from 'react'
import { useUploadManager } from './use-upload-manager'

export const useFileUpload = () => {
  const { files, dispatch, processUpload, MAX_CONCURRENT } = useUploadManager()

  const handleDrop = useCallback(
    (files: File[]) => {
      dispatch({ type: 'ADD_FILES', files })
    },
    [dispatch]
  )

  useEffect(() => {
    const queued = files.filter((f) => f.status === 'queued')
    const active = files.filter((f) => f.status === 'uploading')

    const availableSlots = MAX_CONCURRENT - active.length
    const toProcess = queued.slice(0, availableSlots)

    toProcess.forEach((file) => processUpload(file))
  }, [files, processUpload, MAX_CONCURRENT])

  return { files, handleDrop, dispatch }
}
