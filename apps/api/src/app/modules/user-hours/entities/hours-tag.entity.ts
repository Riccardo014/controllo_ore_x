import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity } from 'typeorm';

@Entity()
export class HoursTag extends BaseEntityTemplate {
  @Column()
  name: string;

  @Column()
  iconName: string;

  @Column({ default: true })
  isModifiable: boolean;
}
