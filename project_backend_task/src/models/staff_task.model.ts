import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Staff_Task {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  staff_id: string;

  @Column({ type: 'nvarchar', length: 200 })
  name_staff: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  task_id: string;

  @Column({ type: 'nvarchar', length: 300 })
  name_task: string;
}
