import { UserReadDto } from '../user/user.dto';
import { HoursTagReadDto } from './hours-tag.dto';

export interface DayoffReadDto {
  _id: string;
  user?: UserReadDto;
  userId: string;
  hoursTagId: string;
  hoursTag?: HoursTagReadDto;
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
  hoursTagId: string;
  startDate: Date;
  endDate: Date;
  hours: number;
  notes: string;
}

export interface DayoffUpdateDto {
  userId?: string;
  startDate?: Date;
  hoursTagId?: string;
  endDate?: Date;
  hours?: number;
  notes?: string;
}
