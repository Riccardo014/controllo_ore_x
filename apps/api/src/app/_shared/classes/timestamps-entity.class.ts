import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class TimestampsEntity {
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
