import { UserController } from '@modules/user/controllers/user.controller';
import { Role } from '@modules/user/entities/role.entity';
import { User } from '@modules/user/entities/user.entity';
import { RoleService } from '@modules/user/services/role.service';
import { UserService } from '@modules/user/services/user.service';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RoleController } from './controllers/role.controller';
import { ROLE_SEED } from './seeds/role.seed';
import { USER_SEED } from './seeds/user.seed';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController, RoleController],
  exports: [UserService, RoleService],
  providers: [UserService, RoleService],
})
export class UserModule {
  constructor(
    private _userService: UserService,
    private _roleService: RoleService,
    private _dataSource: DataSource,
    private _configService: ConfigService,
  ) {
    if (
      this._configService.get<'true' | 'false'>('SEED_DATA_ACTIVE', 'false') ===
      'true'
    ) {
      this.seedData();
    }
  }

  async seedData(): Promise<void> {
    await this.seedRoles();
    await this.seedUsers();
  }

  seedUsers(): Promise<void> {
    Logger.log('[SEED USER] Start seeding...');
    return this._dataSource.transaction(async (TX) => {
      const defaultAdminRole: Role = await this._roleService.getOneBy({
        name: 'Admin',
      });
      for (const user of USER_SEED) {
        const userSaved: User = await this._userService.getOneBy(
          { name: user.name },
          [],
          TX,
        );
        if (!userSaved) {
          await this._userService.create(
            {
              ...user,
              roleId: defaultAdminRole._id,
            },
            TX,
          );
          Logger.log(`[SEED USER] ${user.name} saved`);
        }
      }
      Logger.log('[SEED USER] End seeding process.');
    });
  }

  seedRoles(): Promise<void> {
    Logger.log('[SEED ROLE] Start seeding...');
    return this._dataSource.transaction(async (TX) => {
      for (const role of ROLE_SEED) {
        const roleSaved: Role = await this._roleService.getOneBy(
          { name: role.name },
          [],
          TX,
        );
        if (!roleSaved) {
          await this._roleService.create(role, TX);
          Logger.log(`[SEED ROLE] ${role.name} saved`);
        }
      }
      Logger.log('[SEED ROLE] End seeding process.');
    });
  }
}
