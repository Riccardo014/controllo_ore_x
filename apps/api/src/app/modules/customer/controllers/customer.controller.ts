import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { CustomerService } from '@modules/customer/services/customer.service';
import { CustomerCreateDtoV } from '@modules/customer/dtov/customer-create.dtov';
import { CustomerUpdateDtoV } from '@modules/customer/dtov/customer-update.dtov';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Customer } from '../entities/customer.entity';
import { RoleChecker } from '@shared/utils/role-checker';
import { UserService } from '@modules/user/services/user.service';
import { ApiErrors } from '@shared/utils/errors/api-errors';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private _customerService: CustomerService, private _userService: UserService) {
  }
  @Get()
  getMany(@Query(CastObjectPipe) query: any): Promise<FindBoostedResult<Customer>> {
    return this._customerService.getMany(query);
  }

  @Post('fb')
  getManyFb(@Body() body: FindBoostedOptions): Promise<FindBoostedResult<Customer>> {
    return this._customerService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Customer> {
    return this._customerService.getOne(id);
  }

  @Post()
  create(@Body() data: CustomerCreateDtoV, @AuthUser() user: User): Promise<Customer> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._customerService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string,
         @Body() body: CustomerUpdateDtoV,
         @AuthUser() user: User): Promise<UpdateResult> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._customerService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @AuthUser() user: User): Promise<DeleteResult> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._customerService.delete({ _id: id });
  }
}
