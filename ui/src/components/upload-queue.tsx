import { List } from '@shopify/polaris'
import { UploadItem } from './upload-item'
import type { UploadFile } from '../hooks/use-upload-manager'

export const UploadQueue = ({
  files,
  onRetry,
  onRemove,
}: {
  files: UploadFile[]
  onRetry: (id: string) => void
  onRemove: (id: string) => void
}) => (
  <List>
    {files.map((file) => (
      <UploadItem
        key={file.id}
        file={file}
        onRetry={() => onRetry(file.id)}
        onRemove={() => onRemove(file.id)}
      />
    ))}
  </List>
)
