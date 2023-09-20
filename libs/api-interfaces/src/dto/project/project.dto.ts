export interface ProjectReadDto {
  _id: string;
  name: string;
  customerId: string;
  color: string;
  hours_budget: number;
  expiration_date: Date;
}


export interface ProjectCreateDto {
  name: string;
  customerId: string;
  color?: string;
  hours_budget: number;
  expiration_date: Date;
}


export interface ProjectUpdateDto {
  name?: string;
  customerId?: string;
  color?: string;
  hours_budget?: number;
  expiration_date?: Date;
}
