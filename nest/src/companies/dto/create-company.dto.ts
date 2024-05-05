import { IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Ten cong ty không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Dia chi cong ty không được để trống' })
    address: string;

    @IsNotEmpty({ message: 'Mo ta không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'Logo không được để trống' })
    logo: string;
}
