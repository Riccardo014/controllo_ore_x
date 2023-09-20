import { Customer } from '@modules/customer/entities/customer.entity';
import { IDefaultEntityColumns } from '@shared/classes/i-default-entity-columns';
import { TimestampsEntity } from '@shared/classes/timestamps-entity.class';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project implements IDefaultEntityColumns{
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column(() => TimestampsEntity)
  timeStampEntity: TimestampsEntity;

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
