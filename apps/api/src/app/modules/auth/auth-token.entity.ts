import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';

@Entity()
export class AuthToken extends BaseEntityTemplate {

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
