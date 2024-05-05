import { IsNotEmpty } from "class-validator";

export class CreateProjectDto {
    @IsNotEmpty({ message: 'Ten project không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Dia chi project không được để trống' })
    address: string;

    @IsNotEmpty({ message: 'Mo ta không được để trống' })
    description: string;

    //@IsNotEmpty({ message: 'Logo không được để trống' })
    logo: string;
}
