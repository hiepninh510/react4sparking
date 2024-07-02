import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailTask } from 'src/models/detail_task.model';
import { DetailTaskController } from './detail_task.controller';
import { DetailTaskService } from './detail_task.service';

@Module({
  imports: [TypeOrmModule.forFeature([DetailTask])],
  controllers: [DetailTaskController],
  providers: [DetailTaskService],
  exports: [DetailTaskService],
})
export class DetailTaskModule {}
