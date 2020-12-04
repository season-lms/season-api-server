import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from 'src/class/dto/create-class.dto';

export class UpdateClassDto extends PartialType(CreateClassDto) {}
