import { Body, Controller, Get, Post } from '@nestjs/common';
import { StaffService } from './staff.service';
import { creatStaffDTO } from './dto/creatstaff.dto';
import { Staff } from 'src/models/staff.model';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async creatStaff(@Body() body: creatStaffDTO): Promise<any> {
    return this.staffService.creatStaff(body);
  }

  @Get()
  async getAllStaff(): Promise<Staff[]> {
    return this.staffService.getAllStaff();
  }
}
