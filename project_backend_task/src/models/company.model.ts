import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.model';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'nvarchar', length: 250 })
  name_company: string;

  @Column({ type: 'nvarchar', length: 500 })
  address: string;

  @Column({ type: 'char', length: 10 })
  phone: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'nvarchar', length: 100 })
  representative: string;

  @ManyToMany(() => Project, (project) => project.companys)
  @JoinTable()
  projects: Project[];
}
