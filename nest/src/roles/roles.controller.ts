import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @ResponseMessage('Create a new Role')
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    let data = await this.rolesService.create(createRoleDto, user);

    return {
      _id: data?._id,
      createdAt: data?.createdAt
    };
  }

  @Get()
  @ResponseMessage('Fetch list resum with paginate')
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.rolesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get permission by id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @ResponseMessage('Update a permission')
  @Patch(':id')
  updateStatus(@Param('id') _id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.update(_id, updateRoleDto, user);
  }

  @ResponseMessage('Delete a permission')
  @Delete(':id')
  remove(@Param('id') _id: string, @User() user: IUser) {
    return this.rolesService.remove(_id, user);
  }
}
