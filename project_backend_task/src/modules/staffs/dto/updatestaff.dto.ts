import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class updateStaffDTO {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống!' })
  @IsNumberString()
  @Length(10, 10)
  readonly phone: string;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống!' })
  @IsString()
  readonly address: string;

  @IsNotEmpty({ message: 'Email không được để trống!' })
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: 'Vị trí công việc không được trống!' })
  @IsString()
  readonly position: string;

  @IsString()
  readonly image: string;
}
