import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class creatCompanyDTO {
  @IsNotEmpty({ message: 'Ten cong ty khong duoc de trong!' })
  @IsString()
  readonly name: string;

  @IsNotEmpty({ message: 'Dia chi cong ty khong duoc de trong!' })
  @IsString()
  readonly address: string;

  @IsNotEmpty({ message: 'So dien thoai khong duoc de trong!' })
  @IsNumberString()
  @Length(10, 10)
  readonly phone: string;

  @IsNotEmpty({ message: 'Email khong duoc de trong!' })
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: 'Nguoi dai dien khong duoc de trong!' })
  @IsString()
  readonly representative: string;
}
