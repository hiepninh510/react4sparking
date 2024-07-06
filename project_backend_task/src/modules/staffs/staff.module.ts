import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/models/staff.model';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Staff])],
  providers: [StaffService],
  controllers: [StaffController],
  exports: [StaffService],
})
export class StaffModule {}
