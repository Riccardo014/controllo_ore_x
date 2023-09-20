export interface UserReadDto {
  _id: string;
  email: string;
  name: string;
  surname: string;
  isDeletable: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  //TODO: avatar
}

export interface UserCreateDto {
  email: string;
  name: string;
  surname: string;
  password: string;
  roleId: string;
  //TODO: avatar
}

export interface UserUpdateDto {
  email?: string;
  name?: string;
  surname?: string;
  roleId?: string;
  //TODO: avatar
}
