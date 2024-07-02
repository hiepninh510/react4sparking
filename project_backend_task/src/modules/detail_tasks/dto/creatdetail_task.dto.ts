import { IsNotEmpty, IsString } from 'class-validator';

export class createDetail_TaskDTO {
  @IsNotEmpty({ message: 'Mo tra cong viec khong duoc de trong!' })
  @IsString()
  readonly task_description: string;
}
