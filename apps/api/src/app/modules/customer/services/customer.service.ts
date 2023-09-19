import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { Customer } from '@modules/customer/entities/customer.entity';
import { CustomerCreateDtoV } from '@modules/customer/dtov/customer-create.dtov';
import { CustomerUpdateDtoV } from '@modules/customer/dtov/customer-update.dtov';

@Injectable()
export class CustomerService extends CrudService<Customer, CustomerCreateDtoV, CustomerUpdateDtoV> {
  target: typeof Customer = Customer;
}
