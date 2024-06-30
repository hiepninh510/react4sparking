import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { Response } from 'express';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name)
    private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) { }

  gethashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExits = await this.userModel.findOne({ email: createUserDto.email });

    if (isExits) {
      throw new BadRequestException(`Email ${createUserDto.email} da ton tai!`)
    }

    const hashPassword = this.gethashPassword(createUserDto.password);

    let result = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return result;
  }

  async register(registerUserDto: RegisterUserDto) {

    const isExits = await this.userModel.findOne({ email: registerUserDto.email });

    if (isExits) {
      throw new BadRequestException(`Email ${registerUserDto.email} da ton tai!`)
    }

    //fetch user role
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const hashPassword = this.gethashPassword(registerUserDto.password);

    let user = await this.userModel.create({
      ...registerUserDto,
      password: hashPassword,
      role: userRole?._id,
    })

    return user;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .select('-password')
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec()
      ;

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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Not found user with id=${id}`)

    return await this.userModel.findById(id)
      .select('-password')
      .populate({ path: 'role', select: { _id: 1, name: 1 } }
      );

    //another way
    //return this.userModel.findOne({_id:id})
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }

  async findOneByUsername(username: string) {
    let user = await this.userModel.findOne({
      email: username
    }).populate({ path: 'role', select: { name: 1 } });

    return user;
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      },
    )
  }

  async remove(id: string, user: IUser) {

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Not found user with id=${id}`)

    const foundUser = await this.userModel.findById(id);

    if (foundUser && foundUser.email === 'admin@gmail.com')
      throw new BadRequestException(`Khong the xoa tai khoan admin@gmail.com`)

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.userModel.softDelete({ _id: id })
  }

  updateUserWithRefreshToken = async (_id: string, refreshToken: string) => {

    return await this.userModel.updateOne(
      { _id },
      { refreshToken }
    )
  }

  findUserbyToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken })
      .populate({ path: "role", select: { name: 1 } });
  }
}
