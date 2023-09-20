import { IDefaultEntityColumns } from '@shared/classes/i-default-entity-columns';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class HoursExtra implements IDefaultEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  hours: number;

  @Column()
  notes: string;

  @Column()
  referent: string;
}
