import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/models/company.model';
import { creatCompanyDTO } from './dto/creatcompany.dto';
import { Repository } from 'typeorm';
import { updateCompanyDTO } from './dto/updatecompany.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async creatCompany(body: creatCompanyDTO): Promise<any> {
    const company = new Company();
    const isCompany = await this.companyRepository.findOne({
      where: { name_company: body.name },
    });
    if (!isCompany) {
      company.name_company = body.name;
      company.address = body.address;
      company.email = body.email;
      company.phone = body.phone;
      company.representative = body.representative;

      await this.companyRepository.save(company);
      return {
        massage: `Đã khởi tạo công ty ${company.name_company} thành công!`,
      };
    } else {
      return {
        massage: `Công ty ${body.name} đã tồn tại!`,
      };
    }
  }

  async findCompay(name: string): Promise<any> {
    const company = await this.companyRepository.findOne({
      where: { name_company: name },
    });
    if (company) {
      return company;
    } else {
      return { message: `Không tồn tại ${name}!` };
    }
  }

  async getAllCompany(): Promise<any> {
    const companys = this.companyRepository.find();
    if (companys) {
      return companys;
    } else {
      return { message: 'Danh sách công ty đang trống!' };
    }
  }

  async updateCompany(
    bodyDTO: Partial<updateCompanyDTO>,
    id: string,
  ): Promise<any> {
    const company = await this.companyRepository.findOne({
      where: { id: id },
    });
    for (const key in bodyDTO) {
      if (company.hasOwnProperty(key) && bodyDTO[key] !== company[key]) {
        (company as any)[key] = bodyDTO[key];
      }
    }
    await this.companyRepository.save(company);
    return { message: 'Cập nhật thành công!', company };
  }
}
