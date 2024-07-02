import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetailTask } from './detail_task.model';
import { Project } from './project.model';
import { Staff } from './staff.model';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name_task: string;

  @Column({ type: 'date' })
  start_day: Date;

  @Column({ type: 'date' })
  finish_day: Date;

  @Column()
  status_task: string;

  @Column()
  level_task: string;

  @OneToOne(() => DetailTask, (detail_task) => detail_task.task)
  detail_task: DetailTask;
  @ManyToMany(() => Project, (project) => project.tasks)
  projects: Project[];
  @ManyToMany(() => Staff, (staff) => staff.tasks)
  staffs: Staff[];
}
