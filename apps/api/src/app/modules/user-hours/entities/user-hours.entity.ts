import { User } from '@modules/user/entities/user.entity';
import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Label } from './label.entity';
import { Release } from '@modules/project/entities/release.entity';

@Entity()
export class UserHours extends BaseEntityTemplate {
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: User;
  @Column()
  userId: string;

  @ManyToOne(() => Release, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'releaseId' })
  release?: Release;
  @Column()
  releaseId: string;

  @ManyToOne(() => Label, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'labelId' })
  label?: Label;
  @Column()
  labelId: string;

  @Column()
  date: Date;

  @Column()
  notes: string;

  @Column('decimal', { precision: 6, scale: 2 })
  hours: number;

}
