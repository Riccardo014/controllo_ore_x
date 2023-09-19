import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { ROLE } from '@api-interfaces';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ApiErrors } from './errors/api-errors';

export abstract class RoleChecker {

  static _userService: UserService;
  
  /**
   * Check if the role of the user is in the permitted roles for the request
   * @param user The user that is making the request
   * @param roles The permitted roles
   * @throws BadRequestException if the user is not found
   * @throws ForbiddenException if the user role is not in the permitted roles
   * @returns True if the role of the user is in the permitted roles False otherwise
   */
  static async checkPermission(user: User, roles: ROLE[]): Promise<boolean> {
    const currentUser = await this._userService.getOne( user._id, [ 'role' ] );

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
   * @param user 
   * @returns 
   */
  static async userRoleIsCollaboratorOrHigher(user: User): Promise<boolean> {
    return await this.checkPermission(user, [ ROLE.COLLABORATOR, ROLE.ADMIN, ROLE.SUPERADMIN ]);
  }

  /**
   * Check if the user role is Admin or higher
   * @param user 
   * @returns 
   */
  static async userRoleIsAdminOrHigher(user: User): Promise<boolean> {
    return await this.checkPermission(user, [ ROLE.ADMIN, ROLE.SUPERADMIN ]);
  }

  /**
   * Check if the user role is SuperAdmin or higher
   * @param user 
   * @returns 
   */
  static async userRoleIsSuperAdmin(user: User): Promise<boolean> {
    return await this.checkPermission(user, [ ROLE.SUPERADMIN ]);
  }

}
