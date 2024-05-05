import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @ResponseMessage('Create a new project')
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @User() user: IUser) {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch list company with paginate')
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.projectsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateProjectDto, @User() user: IUser) {
    return this.projectsService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.projectsService.remove(id, user);
  }

}
