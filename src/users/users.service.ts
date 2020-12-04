import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { User } from './schemas/user.schema';

import { StudentService } from 'src/student/student.service';
import { InstructorService } from 'src/instructor/instructor.service';

@Injectable()
export class UsersService {
  @InjectModel(User.name) private readonly userModel: Model<User>;

  @Inject() private readonly studentService: StudentService;
  @Inject() private readonly instructorService: InstructorService;

  public async create(createUserDto: CreateUserDto) {
    const { userId, roles } = createUserDto;
    await this.isUniqueUserId(userId);
    const user = new this.userModel(createUserDto);
    if (roles.includes('student')) {
      const student = await this.studentService.create({
        user: user._id as string,
      });
      user.student = student._id;
      await student.save();
    }
    if (roles.includes('instructor')) {
      const instructor = await this.instructorService.create({
        user: user._id as string,
      });
      user.instructor = instructor._id;
      await instructor.save();
    }
    await user.save();

    const filtered = this.filterUser(user.toObject());
    return filtered;
  }

  public async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset, type } = paginationQuery;

    const conditions = type ? { roles: type } : {};
    const users = await this.userModel
      .find(conditions)
      .populate('student')
      .populate('instructor')
      .skip(offset)
      .limit(limit)
      .sort({ userId: 1 })
      .exec();

    const filtered = [];
    users.forEach((user) => {
      filtered.push(this.filterUser(user.toObject()));
    });
    return filtered;
  }

  public async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate('student')
      .populate('instructor');
    if (!user) {
      throw new NotFoundException('cannot find matched user');
    }

    return user;
  }

  public async findByUserId(userId: string) {
    const user = await this.userModel
      .findOne({ userId })
      .populate('student')
      .populate('instructor')
      .exec();

    if (!user) {
      throw new NotFoundException('cannot find matched user');
    }

    const filtered = this.filterUser(user.toObject());
    return filtered;
  }

  public async findOneByCondition(condition) {
    const user = await this.userModel
      .findOne(condition)
      .populate('student')
      .populate('instructor')
      .exec();
    if (!user) {
      throw new NotFoundException('cannot find matched user');
    }

    return user;
  }

  public async update(req, userId: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.roles && !req.user.roles.includes('admin')) {
      throw new ForbiddenException('cannot update roles');
    }
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new NotFoundException('cannot find matched user');
    }
    Object.assign(user, updateUserDto);
    await user.save();

    const filtered = this.filterUser(user.toObject());
    return filtered;
  }

  public async remove(userId: string) {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new NotFoundException('cannot find matched user');
    }

    const { roles } = user;
    await this.userModel.findByIdAndRemove(user.id);
    if (roles.includes('student')) {
      await this.studentService.removeByUser(user._id);
    }
    if (roles.includes('instructor')) {
      await this.instructorService.removeByUser(user._id);
    }
  }

  public async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ userId: loginDto.userId });
    if (!user) {
      throw new NotFoundException('cannot find matched user');
    }

    const matched = await bcrypt.compare(loginDto.password, user.password);
    if (!matched) {
      throw new UnauthorizedException('password does not match');
    }

    const filtered = this.filterUser(user.toObject());
    filtered['_id'] = user._id;
    return filtered;
  }

  private async isUniqueUserId(userId: string) {
    try {
      const user = await this.findByUserId(userId);
      if (user) {
        throw new BadRequestException('user id is already registered');
      }
    } catch (err) {
      return true;
    }
  }

  private filterUser(populated) {
    delete populated['_id'];
    delete populated['password'];
    if (populated.student) {
      delete populated.student['_id'];
      delete populated.student['user'];
    }
    if (populated.instructor) {
      delete populated.instructor['_id'];
      delete populated.instructor['user'];
    }
    return populated;
  }
}
