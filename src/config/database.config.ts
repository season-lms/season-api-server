import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASS,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
  },
}));
