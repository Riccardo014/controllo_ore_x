import { CustomerReadDto } from '../customer/customer.dto';

export interface ProjectReadDto {
  _id: string;
  name: string;
  customerId: string;
  customer?: CustomerReadDto;
  color: string;
  hoursBudget: number;
  deadline: Date;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}

export interface ProjectCreateDto {
  name: string;
  customerId: string;
  color?: string;
  hoursBudget: number;
  deadline: Date;
}

export interface ProjectUpdateDto {
  name?: string;
  customerId?: string;
  color?: string;
  hoursBudget?: number;
  deadline?: Date;
}
