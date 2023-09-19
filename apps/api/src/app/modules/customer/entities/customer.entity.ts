import { TimestampsEntity } from '@shared/classes/timestamps-entity.class';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer extends TimestampsEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  email!: string;

  @Column({ length: 30 })
  name!: string;

  //TODO: avatar

}