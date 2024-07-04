import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class updateDateForProjectDTO {
  readonly id: string;
  @IsNotEmpty({ message: 'Ngay cap nhat khong duoc de trong' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  finish_day: Date;
}
