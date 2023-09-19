import { TimestampsEntity } from '@shared/classes/timestamps-entity.class';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role extends TimestampsEntity{
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @Column()
    name!: string;

    @Column('simple-json')
    permissions!: Array<{
        description: string;
        active: boolean;
    }>;

    @Column({ default: true })
    isModifiable!: boolean;

}