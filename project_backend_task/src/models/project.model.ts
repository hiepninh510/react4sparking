import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.model';
import { Company } from './company.model';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name_project: string;

  @Column({ type: 'date' })
  start_day: Date;

  @Column({ type: 'date' })
  finish_day: Date;

  @Column()
  lable: string;

  @ManyToMany(() => Task, (task) => task.projects)
  @JoinTable()
  tasks: Task[];

  @ManyToMany(() => Company, (company) => company.projects)
  companys: Company[];
}
