import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Name không được để trống' })
    @IsEmail({}, { message: 'email co dinh dang email' })
    email: string;

    @IsNotEmpty({ message: 'Skills không được để trống' })
    @IsArray({ message: "skills co dinh dang la array" })
    @IsString({ each: true, message: "Skills dinh dang la string" })
    skills: string[];
}
