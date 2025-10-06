import type mongoose from "mongoose"

declare global {
  var mongooseConn: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }

  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string
      JWT_SECRET: string
      NEXT_PUBLIC_API_URL: string
      CLOUDINARY_URL?: string
      EMAIL_HOST?: string
      EMAIL_PORT?: string
      EMAIL_USER?: string
      EMAIL_PASS?: string
      NODE_ENV: "development" | "production" | "test"
    }
  }
}
