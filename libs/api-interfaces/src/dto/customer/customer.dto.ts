export interface CustomerReadDto {
  _id: string;
  email: string;
  name: string;
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