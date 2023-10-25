import { UserReadDto } from '../user/user.dto';

export interface DayoffReadDto {
  _id: string;
  user: UserReadDto;
  userId: string;
  startDate: Date;
  endDate: Date;
  hours: number;
  notes: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}

export interface DayoffCreateDto {
  userId: string;
  startDate: Date;
  endDate: Date;
  hours: number;
  notes: string;
}

export interface DayoffUpdateDto {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  hours?: number;
  notes?: string;
}
