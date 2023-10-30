import { Release } from '@modules/project/entities/release.entity';
import { User } from '@modules/user/entities/user.entity';
import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { HoursTag } from './hours-tag.entity';

@Entity()
export class Activity extends BaseEntityTemplate {
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: User;
  @Column()
  userId?: string;

  @ManyToOne(() => Release, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'releaseId' })
  release?: Release;
  @Column()
  releaseId?: string;

  @ManyToOne(() => HoursTag, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'hoursTagId' })
  hoursTag?: HoursTag;
  @Column()
  hoursTagId?: string;

  @Column()
  date: Date;

  @Column()
  notes: string;

  @Column('decimal', { precision: 6, scale: 2 })
  hours: number;
}
