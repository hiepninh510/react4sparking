import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested, isString } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;


    @IsNotEmpty()
    logo: string;
}

export class CreateJobDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Skills không được để trống' })
    @IsArray({ message: "skills co dinh dang la array" })
    @IsString({ each: true, message: "Skills dinh dang la string" })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: 'location không được để trống' })
    location: string;

    @IsNotEmpty({ message: 'salary không được để trống' })
    salary: number;

    @IsNotEmpty({ message: 'quantity không được để trống' })
    quantity: number;

    @IsNotEmpty({ message: 'level không được để trống' })
    level: string;

    @IsNotEmpty({ message: 'description không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'startDate không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'StartDate co dinh dang la Date' })
    startDate: Date;

    @IsNotEmpty({ message: 'endDate không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'EndDate co dinh dang la Date' })
    endDate: Date;

    @IsNotEmpty({ message: 'isActive không được để trống' })
    @IsBoolean({ message: "isActive co dinh dang la Boolean" })
    isActive: boolean;
}
