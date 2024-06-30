import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProjectDto {
    @IsNotEmpty({ message: 'Tên dự án không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Địa chỉ dự án không được để trống' })
    address: string;

    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    description: string;

    @IsOptional()
    logo: string;

    @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
    startAt: Date;

    @IsOptional()
    endAt: Date;

    // @IsOptional()
    //  handovertime: Date;

    // @IsOptional()
    // acceptanceperiod: Date;

    //   @IsNotEmpty({ message: 'Hạn bảo hành không được để trống' })
    // warantyperiod: Number;
}
