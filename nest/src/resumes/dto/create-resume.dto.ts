import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested, isString } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'userId không được để trống' })
    @IsMongoId({ message: 'userId phai la mongo id' })
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'url không được để trống' })
    url: string;

    @IsNotEmpty({ message: 'status không được để trống' })
    status: string;

    @IsNotEmpty({ message: 'companyId không được để trống' })
    @IsMongoId({ message: 'companyId phai la mongo id' })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'jobId không được để trống' })
    @IsMongoId({ message: 'jobId phai la mongo id' })
    jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserResumeDto {
    @IsNotEmpty({ message: 'url không được để trống' })
    url: string;

    @IsNotEmpty({ message: 'companyId không được để trống' })
    @IsMongoId({ message: 'companyId phai la mongo id' })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'jobId không được để trống' })
    @IsMongoId({ message: 'jobId phai la mongo id' })
    jobId: mongoose.Schema.Types.ObjectId;
}
