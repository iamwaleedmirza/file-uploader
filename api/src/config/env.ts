import 'dotenv/config'

export const config = {
  PORT: process.env.PORT || 8080,
  AWS: {
    ACCESS_KEY: process.env.AWS_ACCESS_KEY!,
    SECRET_KEY: process.env.AWS_SECRET_KEY!,
    REGION: process.env.AWS_REGION!,
    BUCKET: process.env.AWS_BUCKET!,
  },
}
