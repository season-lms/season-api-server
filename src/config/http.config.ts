import { registerAs } from '@nestjs/config';

export default registerAs('http', () => ({
  host: process.env.HTTP_HOST || 'localhost',
  port: parseInt(process.env.HTTP_PORT, 10) || 3000,
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
}));
