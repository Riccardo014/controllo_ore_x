export interface RoleReadDto {
  _id: string;
  name: string;
  permissions: string;
  isModifiable: boolean;
}

export interface RoleCreateDto {
  name: string;
  permissions: string;
}

export interface RoleUpdateDto {
  name?: string;
  permissions?: string;
}
