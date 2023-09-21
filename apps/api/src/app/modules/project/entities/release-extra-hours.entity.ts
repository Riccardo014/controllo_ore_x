import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Release } from './release.entity';

@Entity()
export class ReleaseExtraHours extends BaseEntityTemplate {

  @Column()
  hours: number;

  @Column()
  notes: string;

  @Column()
  referent: string;

  @ManyToOne(() => Release, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'releaseId' })
  release?: Release;
  @Column()
  releaseId: string;

}
