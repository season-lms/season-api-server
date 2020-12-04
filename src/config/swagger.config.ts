import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  host: process.env.SWAGGER_HOST || 'localhost',
  port: parseInt(process.env.SWAGGER_PORT, 10) || 3000,
  path: process.env.SWAGGER_PATH || 'docs',
  options: {
    title: process.env.SWAGGER_TITLE || 'Season LMS API Server',
    description: process.env.SWAGGER_DESCRIPTION || 'API Description',
    version: process.env.SWAGGER_VERSION || '1.0',
  },
}));
