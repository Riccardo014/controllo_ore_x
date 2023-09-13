import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @Column()
    email!: string;

    @Column({ select: false })
    password?: string;

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
} 