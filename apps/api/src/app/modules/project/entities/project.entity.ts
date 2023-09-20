import { Customer } from '@modules/customer/entities/customer.entity';
import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Project extends BaseEntityTemplate{

  @Column()
  name: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer?: Customer;
  @Column()
  customerId: string;

  @Column()
  color: string;

  @Column()
  hoursBudget: number;

  @Column()
  expirationDate: Date;
}
