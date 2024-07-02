import { Body, Controller, Post } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async creatProject(@Body() body: any): Promise<any> {
    return this.projectService.creatProject(body);
  }
}
