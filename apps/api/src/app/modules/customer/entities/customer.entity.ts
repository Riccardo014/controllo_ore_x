import { IDefaultEntityColumns } from '@shared/classes/i-default-entity-columns';
import { TimestampsEntity } from '@shared/classes/timestamps-entity.class';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer implements IDefaultEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column(() => TimestampsEntity)
  timeStampEntity: TimestampsEntity;

  @Column()
  email: string;

  @Column({ length: 30 })
  name: string;

  //TODO: avatar

}
