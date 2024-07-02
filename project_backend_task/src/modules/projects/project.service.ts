import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/models/project.model';
import { Repository } from 'typeorm';
import { creatProject } from './dto/creatproject.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectResponsitory: Repository<Project>,
  ) {}

  async creatProject(creatProjectDTO: creatProject): Promise<any> {
    const project = new Project();
    project.name_project = creatProjectDTO.name;
    project.start_day = creatProjectDTO.start_day;
    project.finish_day = creatProjectDTO.finish_day;
    project.lable = creatProjectDTO.lable;
    await this.projectResponsitory.save(project);
    return { massage: `Khởi tạo dự án '${project.name_project}' thành công!` };
  }

  async findNameProject(name: string): Promise<any> {
    return await this.projectResponsitory.findOne({
      where: { name_project: name },
    });
  }
}
