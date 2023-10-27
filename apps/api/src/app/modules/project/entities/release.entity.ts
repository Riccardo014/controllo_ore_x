import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { UserHours } from '@modules/user-hours/entities/user-hours.entity';

@Entity()
export class Release extends BaseEntityTemplate {
  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project?: Project;
  @Column()
  projectId: string;

  @OneToMany(() => UserHours, (u) => u.release)
  userHours: UserHours[];

  @Column()
  version: string;

  @Column()
  isCompleted: boolean;

  @Column({ nullable: true })
  hoursBudget: number;

  @Column({ nullable: true })
  billableHoursBudget: number;

  @Column({ nullable: true })
  deadline: Date;
}
