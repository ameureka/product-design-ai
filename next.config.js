/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MINDJOURY_API_KEY: process.env.MINDJOURY_API_KEY,
  },
};

module.exports = nextConfig; 