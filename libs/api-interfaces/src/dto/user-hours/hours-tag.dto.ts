export interface HoursTagReadDto {
  _id: string;
  name: string;
  iconName: string;
  isModifiable: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}

export interface HoursTagCreateDto {
  name: string;
  iconName: string;
}

export interface HoursTagUpdateDto {
  name?: string;
  iconName?: string;
}
