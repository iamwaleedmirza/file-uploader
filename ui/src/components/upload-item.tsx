import { List, ProgressBar, Button } from '@shopify/polaris'
import type { UploadFile } from '../hooks/use-upload-manager'

export const UploadItem = ({
  file,
  onRetry,
  onRemove,
}: {
  file: UploadFile
  onRetry: () => void
  onRemove: () => void
}) => (
  <List.Item>
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{file.file.name}</span>
        <span>{file.status}</span>
      </div>

      {file.status === 'uploading' && (
        <ProgressBar progress={file.progress} size='medium' />
      )}

      {file.error && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
          }}
        >
          <span style={{ color: 'red' }}>{file.error}</span>
          {file.retries < 2 && <Button onClick={onRetry}>Retry</Button>}
          <Button onClick={onRemove}>Remove</Button>
        </div>
      )}
    </div>
  </List.Item>
)
