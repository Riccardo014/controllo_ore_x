import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { User } from '@modules/user/entities/user.entity';
import { UserCreateDtoV } from '@modules/user/dtov/user-create.dtov';
import { UserUpdateDtoV } from '@modules/user/dtov/user-update.dtov';
import { ConfigService } from '@nestjs/config';
import { DeleteResult, EntityManager, FindOptionsWhere } from 'typeorm';
import { FindBoostedResult } from '@find-boosted';
import { ApiErrors } from '@shared/utils/errors/api-errors';

@Injectable()
export class UserService extends CrudService<User, UserCreateDtoV, UserUpdateDtoV> {
  target: typeof User = User;

  constructor(
    private _configService: ConfigService,
  ) {
    super();
  }
  
  /**
   * Create a user
   * @param data The user data
   * @param TX The transaction
   * @returns The created user
   */
  create(data: UserCreateDtoV, TX?: EntityManager): Promise<User> {
    const user: User = this.getRepository(TX).create(data);
    user._password = data.password;
    return super.create(user as UserCreateDtoV, TX);
  }

  /**
   * Delete a user
   * @param findConditions The conditions
   * @param TX The transaction
   * @throws UnprocessableEntityException if the user is not deletable
   * @returns The result of the delete operation
   */
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

  /**
   * Give the user with the given email and password
   * @param email The user email
   * @param password The user password
   * @throws BadRequestException if the user is not found
   * @throws NotFoundException if the password is wrong
   * @returns The user with the given email and password
   */
  async getUserByEmailAndPassword(email: string, password: string): Promise<User> {
    const user: User = await this.getRepository().findOne({
      where: { email },
      select: [
        '_id',
        'email',
        'password',
      ],
    });
    if (!user) {
      throw new BadRequestException(ApiErrors.MISSING_USER_DATA);
    }
    if (!(await user.checkPassword(password))) {
      throw new NotFoundException(ApiErrors.WRONG_PASSWORD);
    }

    return this.getOne(user._id);
  }

}
