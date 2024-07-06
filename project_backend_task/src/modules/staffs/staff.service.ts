import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from 'src/models/staff.model';
import { Repository } from 'typeorm';
import { staffDTO } from './dto/creatstaff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffReponsitory: Repository<Staff>,
  ) {}

  async creatStaff(staff: staffDTO): Promise<any> {
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

  async findOneStaff(id_staff: string): Promise<any> {
    return await this.staffReponsitory.findOne({ where: { id: id_staff } });
  }
}
