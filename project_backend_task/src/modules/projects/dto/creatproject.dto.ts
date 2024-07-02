import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class creatProject {
  @IsNotEmpty({ message: 'Ten du an khong duoc de trong!' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Ngay bat dau khong duoc de trong!' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_day: Date;

  @IsNotEmpty({ message: 'Ngay hoan thanh khong duoc de trong!' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  finish_day: Date;

  @IsNotEmpty({ message: 'Nhan dan khong duoc de trong!' })
  @IsString()
  lable: string;
}
