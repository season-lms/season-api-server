import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './schemas/student.schema';

@Injectable()
export class StudentService {
  @InjectModel(Student.name) private readonly studentModel: Model<Student>;

  public async create(createStudentDto) {
    const newStudent = new this.studentModel(createStudentDto);
    await newStudent.save();
    return newStudent;
  }

  findAll() {
    return `This action returns all student`;
  }

  public async findById(id: string) {
    const student = await this.studentModel.findById(id);
    if (!student) {
      throw new NotFoundException('cannt find matched user');
    }
    return student;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  public async removeByUser(user: string) {
    await this.studentModel.findOneAndRemove({ user });
  }
}
