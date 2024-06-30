import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @ResponseMessage('Create a new Resume')
  @Post()
  async create(@Body() createUserResumeDto: CreateUserResumeDto, @User() user: IUser) {
    let data = await this.resumesService.createUserResume(createUserResumeDto, user);
    return {
      _id: data?._id,
      createdAt: data?.createdAt
    };
  }

  @Post('by-user')
  @ResponseMessage('Get resum by User')
  getResumesByUser(@User() user: IUser) {
    return this.resumesService.findbyUsers(user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch list resum with paginate')
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Get resum by id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @ResponseMessage('Update a job')
  @Patch(':id')
  updateStatus(@Param('id') _id: string, @Body("status") status: string, @User() user: IUser) {
    return this.resumesService.update(_id, status, user);
  }

  @ResponseMessage('Delete a job')
  @Delete(':id')
  remove(@Param('id') _id: string, @User() user: IUser) {
    return this.resumesService.remove(_id, user);
  }

}
