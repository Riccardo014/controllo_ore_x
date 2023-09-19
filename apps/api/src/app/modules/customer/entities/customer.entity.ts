import { IDefaultEntityColumns } from '@shared/classes/i-default-entity-columns';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Customer implements IDefaultEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  email: string;

  @Column({ length: 30 })
  name: string;

  //TODO: avatar

}
