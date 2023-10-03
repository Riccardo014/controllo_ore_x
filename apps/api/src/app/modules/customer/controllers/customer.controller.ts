import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { CustomerCreateDtoV } from '@modules/customer/dtov/customer-create.dtov';
import { CustomerUpdateDtoV } from '@modules/customer/dtov/customer-update.dtov';
import { CustomerService } from '@modules/customer/services/customer.service';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { ApiErrors } from '@shared/utils/errors/api-errors';
import { RoleChecker } from '@shared/utils/role-checker';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private _customerService: CustomerService,
    private _userService: UserService,
  ) {}
  @Get()
  getMany(
    @Query(CastObjectPipe) query: any,
  ): Promise<FindBoostedResult<Customer>> {
    return this._customerService.getMany(query);
  }

  @Post('fb')
  getManyFb(
    @Body() body: FindBoostedOptions,
  ): Promise<FindBoostedResult<Customer>> {
    return this._customerService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Customer> {
    return this._customerService.getOne(id);
  }

  @Post()
  create(
    @Body() data: CustomerCreateDtoV,
    @AuthUser() user: User,
  ): Promise<Customer> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._customerService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: CustomerUpdateDtoV,
    @AuthUser() user: User,
  ): Promise<UpdateResult> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._customerService.update(id, body);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<DeleteResult> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._customerService.delete({ _id: id });
  }
}
