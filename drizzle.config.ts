import { defineConfig } from 'drizzle-kit'
import { loadEnvConfig } from '@next/env'

// Load Next.js environment variables (including .env.local)
loadEnvConfig(process.cwd())

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})