import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from './database.constant';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> => {
      const uri = configService.get('database.mongodb.uri');
      const options = configService.get('database.mongodb.options');

      return mongoose.connect(uri, options);
    },
    inject: [ConfigService],
  },
];
