import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) { }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const name = createRoleDto.name;
    const isExist = await this.roleModel.findOne({ name })

    if (isExist)
      throw new BadRequestException(`role voi name=${name} da ton tai`)

    return await this.roleModel.create({
      ...createRoleDto,

      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(_id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException(`Not found permission with id=${_id}`)

    return (await this.roleModel.findById(_id))
      .populate({
        path: 'permissions',
        select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
      });//1 la lay, -1 la khong lay

    //another way: return this.userModel.findOne({_id:id})
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException(`Not found permission with id=${_id}`)

    // const name = updateRoleDto.name;
    // const isExist = await this.roleModel.findOne({ name });

    // if (isExist)
    //   throw new BadRequestException(`Role voi name=${name} da ton tai`)

    return await this.roleModel.updateOne(
      { _id },
      {
        ...updateRoleDto,

        updatedBy: {
          _id: user._id,
          email: user.email
        }
      },
    )
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException(`Khong tim thay role`)

    const foundRole = await this.roleModel.findById(_id);

    if (foundRole.name === ADMIN_ROLE)
      throw new BadRequestException(`Khong the xoa role ADMIN`)

    await this.roleModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.roleModel.softDelete({ _id })
  }
}
