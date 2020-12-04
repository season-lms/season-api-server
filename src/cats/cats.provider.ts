import { Connection } from 'mongoose';
import { CatSchema } from './schemas/cat.schema';
import { CAT_MODEL } from './cats.constant';
import { DATABASE_CONNECTION } from 'src/database/database.constant';

export const catsProviders = [
  {
    provide: CAT_MODEL,
    useFactory: (connection: Connection) => connection.model('Cat', CatSchema),
    inject: [DATABASE_CONNECTION],
  },
];
