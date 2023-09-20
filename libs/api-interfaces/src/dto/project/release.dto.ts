export interface ReleaseReadDto {
  _id: string;
  projectId: string;
  version: string;
  hoursBudget: number;
  billableHoursBudget: number;
  expirationDate: Date;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}


export interface ReleaseCreateDto {
  projectId: string;
  version: string;
  hoursBudget: number;
  billableHoursBudget: number;
  expirationDate: Date;
}


export interface ReleaseUpdateDto {
  projectId?: string;
  version?: string;
  hoursBudget?: number;
  billableHoursBudget?: number;
  expirationDate?: Date;
}