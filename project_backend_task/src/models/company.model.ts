import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Project } from './project.model';

@Entity()
export class Company {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name_company: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @ManyToMany(() => Project, (project) => project.companys)
  @JoinTable()
  projects: Project[];
}
