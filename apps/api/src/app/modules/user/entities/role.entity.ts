import { IDefaultEntityColumns } from '@shared/classes/i-default-entity-columns';
import { TimestampsEntity } from '@shared/classes/timestamps-entity.class';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role implements IDefaultEntityColumns{
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @Column(() => TimestampsEntity, { prefix: false })
    timeStampEntity: TimestampsEntity;

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
