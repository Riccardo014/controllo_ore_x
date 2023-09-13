import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@modules/role/entities/role.entity';
import { RoleService } from '@modules/role/services/role.service';
import { RoleController } from '@modules/role/controllers/role.controller';
import { ConfigService } from "@nestjs/config";
import { ROLE_SEED } from "./seeds/role.seed";
import { DataSource } from "typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
    ])
  ],
  controllers: [
    RoleController,
  ],
  exports: [
    RoleService,
  ],
  providers: [
    RoleService,
  ]
})
export class RoleModule {
  constructor(
    private _roleService: RoleService,
    private _dataSource: DataSource,
    private _configService: ConfigService
  ) {
    if (this._configService.get<'true' | 'false'>('SEED_DATA_ACTIVE', 'false') === 'true') {
      this.seedData();
    }
  }

  async seedData(): Promise<void> {
    await this.seedRoles();
  }

  seedRoles(): Promise<void> {
    Logger.log('[SEED ROLE] Start seeding...');
    return this._dataSource.transaction(async (TX) => {
      for (const role of ROLE_SEED) {
        const roleSaved: Role = await this._roleService.getOneBy({ name: role.name }, [], TX);
        if (!roleSaved) {
          await this._roleService.create(role, TX);
          Logger.log(`[SEED ROLE] ${role.name} saved`);
        }
      }
      Logger.log('[SEED ROLE] End seeding process.');
    });
  }

}