import { IDefaultEntityColumns } from '@shared/classes/i-default-entity-columns';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Role implements IDefaultEntityColumns{
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    name: string;

    @Column('simple-json')
    permissions: Array<{
        description: string;
        active: boolean;
    }>;

    @Column({ default: true })
    isModifiable: boolean;

}
