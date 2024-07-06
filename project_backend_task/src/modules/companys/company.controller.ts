import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getAllCompany(): Promise<any> {
    return this.companyService.getAllCompany();
  }

  @Post()
  async creatCompany(@Body() body: any): Promise<any> {
    return this.companyService.creatCompany(body);
  }

  @Put()
  async updateCompany(@Body() body: any): Promise<any> {
    return this.companyService.updateCompany(body.companyDTO, body.id);
  }
}
