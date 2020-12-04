import { Exclude, Expose } from 'class-transformer';

export class CatEntity {
  name: string;
  age: number;

  @Exclude()
  breed: string;

  @Expose()
  get owner(): string {
    return `${this.name}'s owner is Jay Cha`;
  }

  constructor(partial: Partial<CatEntity>) {
    Object.assign(this, partial);
  }
}
