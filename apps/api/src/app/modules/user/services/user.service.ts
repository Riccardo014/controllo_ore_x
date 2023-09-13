import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { User } from '@modules/user/entities/user.entity';
import { UserCreateDtoV } from '@modules/user/dtov/user-create.dtov';
import { UserUpdateDtoV } from '@modules/user/dtov/user-update.dtov';
import { ConfigService } from '@nestjs/config';
import { DeleteResult, EntityManager, FindOptionsWhere } from 'typeorm';
import { FindBoostedResult } from '@find-boosted';

@Injectable()
export class UserService extends CrudService<User, UserCreateDtoV, UserUpdateDtoV> {
  target: typeof User = User;

  constructor(
    private _configSvc: ConfigService,
  ) {
    super();
  }
  
  create(data: UserCreateDtoV, TX?: EntityManager): Promise<User> {
    const user: User = this.getRepository(TX).create(data);
    user.password = data.password;
    return super.create(user as UserCreateDtoV, TX);
  }

  async delete(findConditions: string | FindOptionsWhere<User>, TX?: EntityManager): Promise<DeleteResult> {
    if (typeof findConditions === 'string') {
      const user: User = await this.getOne(findConditions, [], TX);
      if (!user.isDeletable) {
        throw new UnprocessableEntityException('Impossible to delete user.');
      }
    } else {
      const users: FindBoostedResult<User> = await this.getMany({ where: findConditions }, TX);
      for (const user of users.data) {
        if (!user.isDeletable) {
          throw new UnprocessableEntityException('Impossible to delete user.');
        }
      }
    }
    return super.delete(findConditions, TX);
  }

}
