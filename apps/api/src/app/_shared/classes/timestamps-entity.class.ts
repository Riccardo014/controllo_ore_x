import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class TimestampsEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
