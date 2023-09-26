import { UserReadDto } from '../user/user.dto';

export interface LoginResponseDto {
  user: UserReadDto;
  token: string;
}
