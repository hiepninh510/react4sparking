import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from 'src/models/staff.model';
import { Repository } from 'typeorm';
import { updateStaffDTO } from './dto/updatestaff.dto';
import { creatStaffDTO } from './dto/creatstaff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffReponsitory: Repository<Staff>,
  ) {}

  async creatStaff(staff: creatStaffDTO): Promise<any> {
    const newStaff = new Staff();
    newStaff.name_staff = staff.name;
    newStaff.address = staff.address;
    newStaff.email = staff.email;
    newStaff.phone = staff.phone;
    newStaff.positions = staff.position;
    newStaff.image = staff.image;
    newStaff.giotinh = staff.giotinh;

    if (await this.staffReponsitory.save(newStaff)) {
      return { message: 'Tạo nhân viên mới thành công!', newStaff };
    } else {
      return { message: 'Khởi tạo nhân viên không thành công!' };
    }
  }

  async getAllStaff(): Promise<Staff[]> {
    return await this.staffReponsitory.find();
  }

  async findOneStaff(id_staff: string): Promise<Staff> {
    return await this.staffReponsitory.findOne({ where: { id: id_staff } });
  }

  async updateInfrStaff(
    staff: Partial<updateStaffDTO>,
    id: string,
  ): Promise<any> {
    const _staff = await this.staffReponsitory.findOne({ where: { id: id } });
    for (const key in staff) {
      if (_staff.hasOwnProperty(key) && _staff[key] !== staff[key]) {
        (_staff as any)[key] = staff[key];
      }
    }
    if (await this.staffReponsitory.save(_staff)) {
      return { message: `Cập nhật thành công! \n ${_staff}` };
    } else {
      return { messge: 'Cập nhật không thành công!' };
    }
  }
}
