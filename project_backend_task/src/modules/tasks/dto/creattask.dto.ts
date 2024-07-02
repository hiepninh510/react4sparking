import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
} from 'class-validator/types/decorator/decorators';

export class createTaskDTO {
  @IsNotEmpty({ message: 'Ten task khong duoc de trong!' })
  @IsString()
  readonly name: string;

  @IsNotEmpty({ message: 'Ngay bat dau khong duoc de trong!' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Ngay bat dau phai co dinh dang dd/MM/yyyy!' })
  readonly start_day: Date;

  @IsNotEmpty({ message: 'Ngay hoan thanh khong duoc de trong!' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Ngay ket thuc phai co dinh dang dd/MM/yyyy!' })
  readonly finish_day: Date;

  @IsNotEmpty({ message: 'Trang thai khong duoc de trong!' })
  @IsString()
  readonly status: string;

  @IsNotEmpty({ message: 'Cap do cua task khong duoc de trong' })
  @IsString()
  readonly level: string;
}
