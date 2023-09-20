import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity } from 'typeorm';

@Entity()
export class HoursExtra extends BaseEntityTemplate {

  @Column()
  hours: number;

  @Column()
  notes: string;

  @Column()
  referent: string;
}
