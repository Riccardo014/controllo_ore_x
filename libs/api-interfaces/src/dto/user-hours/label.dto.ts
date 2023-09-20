export interface LabelReadDto {
  _id: string;
  name: string;
  iconName: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}


export interface LabelCreateDto {
  name: string;
  iconName: string;
}


export interface LabelUpdateDto {
  name?: string;
  iconName?: string;
}
