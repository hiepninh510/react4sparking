import { Body, Controller, Post } from '@nestjs/common';
import { StaffService } from './staff.service';
import { staffDTO } from './dto/creatstaff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async creatStaff(@Body() body: staffDTO): Promise<any> {
    return this.staffService.creatStaff(body);
  }
}
