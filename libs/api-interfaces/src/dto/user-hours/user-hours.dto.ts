export interface UserHoursReadDto {
  _id: string;
  userId: string;
  releaseId: string;
  hoursTagId: string;
  date: Date;
  notes: string;
  hours: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}

export interface UserHoursCreateDto {
  userId: string;
  releaseId: string;
  hoursTagId: string;
  date: Date;
  notes: string;
  hours: number;
}

export interface UserHoursUpdateDto {
  userId?: string;
  releaseId?: string;
  hoursTagId?: string;
  date?: Date;
  notes?: string;
  hours?: number;
}
