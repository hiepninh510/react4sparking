import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateJobDto extends PartialType(CreateJobDto) {
    // @IsNotEmpty({ message: 'id khong duoc de trong' })
    // _id: string;
}
