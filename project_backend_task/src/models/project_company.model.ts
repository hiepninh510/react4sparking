import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Project_Company {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id_company: string;

  @Column({ type: 'nvarchar', length: 250 })
  name_company: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  id_project: string;

  @Column({ type: 'nvarchar', length: 250 })
  name_project: string;
}
