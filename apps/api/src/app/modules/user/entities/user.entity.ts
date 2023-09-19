import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.entity';
import { RtHash } from '@shared/classes/rt-hash.class';
import { IDefaultEntityColumns } from '@shared/classes/i-default-entity-columns';

@Entity()
export class User implements IDefaultEntityColumns{
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  email: string;

  @Column({ select: false })
  password?: string;

  _password: string | null;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role?: Role;
  @Column()
  roleId: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 30 })
  surname: string;

  /* @Column("blob")
  avatar!: Buffer; */

  @Column({ default: true })
  isDeletable: boolean;

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
