import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/models/project.model';
import { Repository } from 'typeorm';
import { creatProject } from './dto/creatproject.dto';
import { updateDateForProjectDTO } from './dto/updateproject.dto';
import { Project_Company } from 'src/models/project_company.model';
import { CompanyService } from '../companys/company.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectResponsitory: Repository<Project>,
    @InjectRepository(Project_Company)
    private readonly project_CompanyReponsitory: Repository<Project_Company>,
    private readonly companyService: CompanyService,
  ) {}

  async creatProject(
    creatProjectDTO: creatProject,
    name_company: string,
  ): Promise<any> {
    const isCompany = await this.companyService.findCompay(name_company);
    if (isCompany) {
      const project = new Project();
      project.name_project = creatProjectDTO.name;
      project.start_day = creatProjectDTO.start_day;
      project.finish_day = creatProjectDTO.finish_day;
      project.lable = creatProjectDTO.lable;
      await this.projectResponsitory.save(project);
      const project_company = new Project_Company();
      project_company.id_company = isCompany.id;
      project_company.name_company = isCompany.name_company;
      project_company.id_project = project.id;
      project_company.name_project = project.name_project;
      await this.project_CompanyReponsitory.save(project_company);
      return {
        massage: `Khởi tạo dự án '${project.name_project}' thành công!`,
      };
    } else {
      return {
        message: `Không thể khởi tạo ${creatProjectDTO.name} vì ${name_company} không tồn tại!`,
      };
    }
  }

  async findNameProject(name: string): Promise<any> {
    return await this.projectResponsitory.findOne({
      where: { name_project: name },
    });
  }

  async updateDate(date: updateDateForProjectDTO): Promise<any> {
    const project = await this.projectResponsitory.findOne({
      where: { id: date.id },
    });
    if (project && project.start_day < date.finish_day) {
      project.finish_day = date.finish_day;
      await this.projectResponsitory.save(project);
      return project;
    } else {
      return { message: 'Cập nhật ngày không thành công!' };
    }
  }
}
