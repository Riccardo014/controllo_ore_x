import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '@modules/customer/entities/customer.entity';
import { CustomerService } from '@modules/customer/services/customer.service';
import { CustomerController } from '@modules/customer/controllers/customer.controller';
import { UserService } from '@modules/user/services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
    ])
  ],
  controllers: [
    CustomerController,
  ],
  exports: [
    CustomerService,
  ],
  providers: [
    CustomerService,
    UserService,
  ]
})
export class CustomerModule {}