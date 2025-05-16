import { Card, DropZone } from '@shopify/polaris'
import { useFileUpload } from '../hooks/use-file-upload'
import { UploadQueue } from './upload-queue'

export const FileUploader = () => {
  const { files, handleDrop, dispatch } = useFileUpload()

  const handleRetry = (id: string) => {
    dispatch({ type: 'RETRY_UPLOAD', id })
  }

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_FILE', id })
  }

  return (
    <Card>
      <DropZone
        onDrop={handleDrop}
        allowMultiple
        label='Drag and drop files to upload'
      />

      <UploadQueue
        files={files}
        onRetry={handleRetry}
        onRemove={handleRemove}
      />
    </Card>
  )
}
