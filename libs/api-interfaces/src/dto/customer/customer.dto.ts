export interface CustomerReadDto {
  _id: string;
  email: string;
  name: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  //TODO: avatar
}

export interface CustomerCreateDto {
  email: string;
  name: string;
  //TODO: avatar
}

export interface CustomerUpdateDto {
  email?: string;
  name?: string;
  //TODO: avatar
}
