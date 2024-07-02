import { IsNotEmpty, IsString } from 'class-validator';

export class updateDetail_Task {
  @IsNotEmpty({ message: 'Mô tả công việc không được để trống!' })
  @IsString()
  readonly task_detail: string;
}
