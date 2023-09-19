import { TimestampsEntity } from '@shared/classes/timestamps-entity.class';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';

@Entity()
export class AuthToken extends TimestampsEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

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
