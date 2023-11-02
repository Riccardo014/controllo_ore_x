import { User } from '@modules/user/entities/user.entity';
import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { HoursTag } from './hours-tag.entity';

@Entity()
export class Dayoff extends BaseEntityTemplate {
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: User;
  @Column()
  userId: string;

  @ManyToOne(() => HoursTag, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'hoursTagId' })
  hoursTag?: HoursTag;
  @Column()
  hoursTagId: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  notes: string;

  @Column('decimal', { precision: 6, scale: 2 })
  hours: number;
}
