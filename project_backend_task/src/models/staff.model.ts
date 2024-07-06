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

  @Column({ type: 'nvarchar', length: 200 })
  name_staff: string;

  @Column({ type: 'varchar', length: 10 })
  phone: string;

  @Column({ type: 'nvarchar', length: 500 })
  address: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'nvarchar', length: 100 })
  positions: string;

  @Column({ type: 'varchar', length: 200 })
  image: string;

  @Column({ type: 'bit', width: 1 })
  giotinh: boolean;

  @ManyToMany(() => Task, (task) => task.staffs)
  @JoinTable()
  tasks: Task[];
}
