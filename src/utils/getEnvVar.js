import dotenv from 'dotenv';
dotenv.config();

export const getEnvVar = (key) => {
  const value = process.env[key];
  if (!value) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
  return value;
};
