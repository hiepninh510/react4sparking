import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IUser } from 'src/users/users.interface';
import { Project, ProjectDocument } from './schemas/project.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: SoftDeleteModel<ProjectDocument>) { }

  create(createProjectDto: CreateProjectDto, user: IUser) {
    return this.projectModel.create({
      ...createProjectDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.projectModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    // if (isEmpty(sort)) {
    //   // @ts-ignore: Unreachable code error
    //   sort = "-updatedAt"
    // }
    const result = await this.projectModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    //     let { sort } = <{ sort: any }>aqp(qs);
    //     let { sort }: { sort: any } = aqp(qs);
    // .sort(sort as any)

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
      throw new BadRequestException(`Not found project with id=${id}`)

    return await this.projectModel.findOne({ _id: id });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: IUser) {
    return await this.projectModel.updateOne(
      { _id: id },
      {
        ...updateProjectDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `Not found project with id = ${id}`;

    await this.projectModel.updateOne(
      { _id: id, },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })

    return this.projectModel.softDelete({ _id: id })
  }
}
