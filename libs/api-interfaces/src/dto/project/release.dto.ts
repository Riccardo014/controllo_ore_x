import { UserHoursReadDto } from '../user-hours/user-hours.dto';
import { ProjectReadDto } from './project.dto';

export interface ReleaseReadDto {
  _id: string;
  projectId: string;
  project?: ProjectReadDto;
  version: string;
  isCompleted: boolean;
  hoursBudget: number;
  billableHoursBudget: number;
  deadline: Date;
  userHours: UserHoursReadDto[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}


export interface ReleaseCreateDto {
  projectId: string;
  version: string;
  isCompleted: boolean;
  hoursBudget: number;
  billableHoursBudget: number;
  deadline: Date;
}


export interface ReleaseUpdateDto {
  projectId?: string;
  version?: string;
  isCompleted?: boolean;
  hoursBudget?: number;
  billableHoursBudget?: number;
  deadline?: Date;
}
