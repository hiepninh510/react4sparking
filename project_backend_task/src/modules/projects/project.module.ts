import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/models/project.model';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project_Company } from 'src/models/project_company.model';
import { CompanyModule } from '../companys/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Project_Company]),
    CompanyModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
