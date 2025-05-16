# Improved File Uploader

A high-performance file uploading solution that uses presigned URLs and concurrent uploads for efficient and secure file transfers.

## Features

- Secure file uploads using presigned URLs
- Progress tracking

## Technologies Used

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express TypeScript
- **Storage**: AWS S3

## Why Presigned URLs?

This project uses presigned URLs for file uploads for several important reasons:

1. **Security**: Files are uploaded directly to cloud storage without passing through the application server, reducing security risks.
2. **Scalability**: The application server doesn't need to handle the file data, significantly reducing server load.
3. **Performance**: Direct-to-storage uploads are typically faster than proxy uploads through a server.
4. **Cost Efficiency**: Reduced server processing and bandwidth usage leads to lower operating costs.
5. **Temporary Access**: Presigned URLs expire after a set time, providing an additional security layer.

## Frontend Concurrent Upload Implementation

The frontend implements a concurrent upload mechanism that:

1. **Parallel Uploading**: Multiple files are uploaded simultaneously, utilizing available bandwidth more effectively.
2. **Retry Logic**: Failed uploads are automatically retried without affecting the overall upload.
3. **Progress Tracking**: Real-time progress calculation based on successfully uploaded chunks.

This approach significantly improves upload speeds, especially for large files and users with good internet connections, while also providing resilience against network issues.

## How to Run

### Prerequisites

- Node.js
- npm or yarn
- AWS account with S3 bucket configured

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   PORT=8080
   AWS_REGION=your-aws-region
   AWS_BUCKET_NAME=your-s3-bucket-name
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd ui
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the backend URL:

   ```
   REACT_APP_API_URL=http://localhost:8080
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Access the application at `http://localhost:5173`
