import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { RtHash } from '@shared/classes/rt-hash.class';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  email!: string;

  @Column({ select: false })
  password?: string;

  _password!: string | null;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role?: Role;
  @Column()
  roleId!: string;

  @Column({ length: 30 })
  name!: string;

  @Column({ length: 30 })
  surname!: string;

  /* @Column("blob")
  avatar!: Buffer; */

  @Column({ default: true })
  isDeletable!: boolean;

  @BeforeInsert()
  async createHashingPassword(): Promise<void> {
    if (!this._password) {
      throw new Error('User password must be set');
    }
    this.password = await RtHash.generate(this._password);
  }

  async checkPassword(_password: string): Promise<boolean> {
    if (!_password) {
      throw new Error('Set password to check');
    }
    return await RtHash.compare(_password, this.password);
  }

} 