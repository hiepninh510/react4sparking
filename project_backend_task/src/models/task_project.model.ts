import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Task_Project {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  project_id: string;

  @Column({ type: 'nvarchar', length: 250 })
  name_project: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  task_id: string;

  @Column({ type: 'nvarchar', length: 300 })
  name_task: string;
}
