import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserSchema } from './schemas/user.schema';
import { StudentModule } from 'src/student/student.module';
import { InstructorModule } from 'src/instructor/instructor.module';

@Module({
  imports: [
    StudentModule,
    InstructorModule,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (next: mongoose.HookNextFunction) {
            try {
              if (this.isNew || this.isModified('password')) {
                const hashed = await bcrypt.hash(this['password'], 10);
                this['password'] = hashed;
              }
              return next();
            } catch (err) {
              return next(err);
            }
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
