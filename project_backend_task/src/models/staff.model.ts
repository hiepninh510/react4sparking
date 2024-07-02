import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.model';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name_staff: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  position: string;

  @Column()
  image: string;

  @ManyToMany(() => Task, (task) => task.staffs)
  @JoinTable()
  tasks: Task[];
}
