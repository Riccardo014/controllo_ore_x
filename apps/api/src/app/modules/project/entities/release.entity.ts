import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Release extends BaseEntityTemplate{


  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project?: Project;
  @Column()
  projectId: string;

  @Column()
  version: string;

  @Column( { nullable: true } )
  hoursBudget: number;

  @Column( { nullable: true } )
  billableHoursBudget: number;

  @Column( { nullable: true } )
  expirationDate: Date;

}
