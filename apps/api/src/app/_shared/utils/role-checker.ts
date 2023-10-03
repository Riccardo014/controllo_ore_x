import { ROLE } from '@api-interfaces';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ApiErrors } from './errors/api-errors';

export abstract class RoleChecker {
  /**
   * Check if the role of the user is in the permitted roles for the request
   * @param user The user that is making the request
   * @param roles The permitted roles
   * @throws BadRequestException if the user is not found
   * @throws ForbiddenException if the user role is not in the permitted roles
   * @returns True if the role of the user is in the permitted roles False otherwise
   */
  static async _checkPermission(
    user: User,
    roles: ROLE[],
    _userService: UserService,
  ): Promise<boolean> {
    const currentUser = await _userService.getOne(user._id, ['role']);

    if (!currentUser) {
      throw new BadRequestException(ApiErrors.MISSING_USER_DATA);
    }
    if (!roles.includes(currentUser.role.name as ROLE)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return true;
  }

  /**
   * Check if the user role is Collaborator or higher
   */
  static async isUserRoleCollaboratorOrHigher(
    user: User,
    _userService: UserService,
  ): Promise<boolean> {
    return await this._checkPermission(
      user,
      [ROLE.COLLABORATOR, ROLE.ADMIN, ROLE.SUPERADMIN],
      _userService,
    );
  }

  /**
   * Check if the user role is Admin or higher
   */
  static async isUserRoleAdminOrHigher(
    user: User,
    _userService: UserService,
  ): Promise<boolean> {
    return await this._checkPermission(
      user,
      [ROLE.ADMIN, ROLE.SUPERADMIN],
      _userService,
    );
  }

  /**
   * Check if the user role is SuperAdmin or higher
   */
  static async isUserRoleSuperAdmin(
    user: User,
    _userService: UserService,
  ): Promise<boolean> {
    return await this._checkPermission(user, [ROLE.SUPERADMIN], _userService);
  }
}
