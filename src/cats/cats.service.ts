import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Cat, CatDocument } from './schemas/cat.schema';
import { CreateCatDto } from './dto';
import { CAT_MODEL } from './cats.constant';
import { CatEntity } from './entities/cat.entity';
import { AppLogger } from 'src/logger/app-logger.provider';

@Injectable()
export class CatsService {
  @Inject(CAT_MODEL)
  private catModel: Model<CatDocument>;

  private logger = new AppLogger(CatsService.name);

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  async findOne(id: string): Promise<CatEntity> {
    const foundCat = await this.catModel.findOne({ _id: id }).exec();
    const { name, age, breed } = foundCat;
    return new CatEntity({
      name,
      age,
      breed,
    });
  }
}
