import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TestProva {
    @PrimaryGeneratedColumn('uuid')
    _id: string;
}