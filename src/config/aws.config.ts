import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  s3: {
    key: {
      access: process.env.S3_ACCESS_KEY,
      secret: process.env.S3_SECRET_KEY,
    },
  },
}));
