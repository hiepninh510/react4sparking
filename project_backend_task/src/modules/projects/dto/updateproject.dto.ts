import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class updateDateForProjectDTO {
  @IsNotEmpty({ message: 'Ngay cap nhat khong duoc de trong' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  private readonly finish_day: Date;
}
