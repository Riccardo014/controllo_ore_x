import { UserReadDto } from '../user/user.dto';

export interface ActivityReadDto {
  _id: string;
  userId: string;
  user?: UserReadDto;
  releaseId?: string;
  hoursTagId?: string;
  date: Date;
  notes: string;
  hours: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}
export interface ActivityCreateDto {
  userId: string;
  releaseId?: string;
  hoursTagId?: string;
  date: Date;
  notes: string;
  hours: number;
}

export interface ActivityUpdateDto {
  userId?: string;
  releaseId?: string;
  hoursTagId?: string;
  date?: Date;
  notes?: string;
  hours?: number;
}
