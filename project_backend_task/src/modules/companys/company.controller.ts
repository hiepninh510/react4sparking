import { Body, Controller, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { updateCompanyDTO } from './dto/updatecompany.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async creatCompany(@Body() body: any): Promise<any> {
    return this.companyService.creatCompany(body);
  }

  async updateCompany(
    body: Partial<updateCompanyDTO>,
    id: string,
  ): Promise<any> {
    return this.companyService.updateCompany(body, id);
  }
}
