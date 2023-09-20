import { IDefaultEntityColumns } from '@shared/classes/i-default-entity-columns';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { TimestampsEntity } from '@shared/classes/timestamps-entity.class';

@Entity()
export class AuthToken implements IDefaultEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column(() => TimestampsEntity, { prefix: false })
  timeStampEntity: TimestampsEntity;

  @Column()
  token: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  userId: string;

  @Column()
  validUntil: Date;
}
