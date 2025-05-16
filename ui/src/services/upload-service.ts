interface PresignedPostResponse {
  url: string
  fields: Record<string, string>
}

export const UploadService = {
  getPresignedUrl: async (file: File): Promise<PresignedPostResponse> => {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_API_URL}/upload/presigned`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      }
    )
    return response.json()
  },

  uploadToS3: async (
    url: string,
    fields: Record<string, string>,
    file: File,
    onProgress: (progress: number) => void
  ) => {
    const formData = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value)
    })
    formData.append('file', file)

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          onProgress(progress)
        }
      }
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve(xhr.response)
          : reject(new Error('Upload failed'))
      xhr.onerror = () => reject(new Error('Network error'))
      xhr.open('POST', url)
      xhr.send(formData)
    })
  },
}
