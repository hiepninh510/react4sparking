import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @ResponseMessage('Create a new permissions')
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    let data = await this.permissionsService.create(createPermissionDto, user);

    return {
      _id: data?._id,
      createdAt: data?.createdAt
    };
  }

  @Get()
  @ResponseMessage('Fetch list permissions with paginate')
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.permissionsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get permission by id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @ResponseMessage('Update a permission')
  @Patch(':id')
  updateStatus(@Param('id') _id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionsService.update(_id, updatePermissionDto, user);
  }

  @ResponseMessage('Delete a permission')
  @Delete(':id')
  remove(@Param('id') _id: string, @User() user: IUser) {
    return this.permissionsService.remove(_id, user);
  }
}
