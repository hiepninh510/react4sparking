import { IsArray, IsBoolean, IsDate, IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested, isString } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'description không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'isActive không được để trống' })
    @IsBoolean()
    isActive: boolean;

    @IsNotEmpty({ message: 'permission không được để trống' })
    @IsMongoId({ each: true, message: 'each permission la mongo object id' })
    @IsArray({ message: 'permission dinh dang la Array' })
    permissions: mongoose.Schema.Types.ObjectId[];
}