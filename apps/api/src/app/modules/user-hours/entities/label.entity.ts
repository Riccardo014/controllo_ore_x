import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity } from 'typeorm';

@Entity()
export class Label extends BaseEntityTemplate {

  @Column()
  name: string;

  @Column()
  iconName: string;

}
