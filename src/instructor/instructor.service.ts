import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Instructor } from '../instructor/schemas/instructor.schema';
import { Model } from 'mongoose';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

@Injectable()
export class InstructorService {
  @InjectModel(Instructor.name)
  private readonly instructorModel: Model<Instructor>;
  public async create(createInstructorDto) {
    const newInstructor = new this.instructorModel(createInstructorDto);
    await newInstructor.save();
    return newInstructor;
  }

  findAll() {
    return `This action returns all instructor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} instructor`;
  }

  update(id: number, updateInstructorDto: UpdateInstructorDto) {
    return `This action updates a #${id} instructor`;
  }

  remove(id: number) {
    return `This action removes a #${id} instructor`;
  }

  public async removeByUser(user: string) {
    await this.instructorModel.findOneAndRemove({ user });
  }
}
