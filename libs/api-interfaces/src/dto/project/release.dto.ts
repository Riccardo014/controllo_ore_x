export interface ReleaseReadDto {
  _id: string;
  projectId: string;
  version: string;
  isCompleted: boolean;
  hoursBudget: number;
  billableHoursBudget: number;
  deadline: Date;
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
