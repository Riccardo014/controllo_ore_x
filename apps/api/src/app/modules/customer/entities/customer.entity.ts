import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity } from 'typeorm';

@Entity()
export class Customer extends BaseEntityTemplate {

  @Column()
  email: string;

  @Column({ length: 30 })
  name: string;

  //TODO: avatar

}
