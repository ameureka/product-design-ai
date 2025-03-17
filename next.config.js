/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MINDJOURY_API_KEY: process.env.MINDJOURY_API_KEY,
    DIFY_API_KEY_001_workflow: process.env.DIFY_API_KEY_001_workflow,
    DIFY_API_KEY_API: process.env.DIFY_API_KEY_API,
    DIFY_API_KEY_CHAT: process.env.DIFY_API_KEY_CHAT,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000'
  }
};

module.exports = nextConfig; 