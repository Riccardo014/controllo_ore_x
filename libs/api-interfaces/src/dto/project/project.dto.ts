export interface ProjectReadDto {
  _id: string;
  name: string;
  customerId: string;
  color: string;
  hoursBudget: number;
  expirationDate: Date;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}


export interface ProjectCreateDto {
  name: string;
  customerId: string;
  color?: string;
  hoursBudget: number;
  expirationDate: Date;
}


export interface ProjectUpdateDto {
  name?: string;
  customerId?: string;
  color?: string;
  hoursBudget?: number;
  expirationDate?: Date;
}
