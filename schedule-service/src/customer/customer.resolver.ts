import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import {
  CreateCustomerResponse,
  Customer,
  CustomerPaginatedResponse,
} from './entities/customer.entity';
import {
  CustomerInput,
  PaginationInput,
  UpdateCustomerInput,
} from './dto/create-customer.input';
import { InternalServerErrorException } from '@nestjs/common';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Mutation(() => CreateCustomerResponse)
  createCustomer(@Args('input') input: CustomerInput) {
    return this.customerService.createCustomer(input);
  }

  @Mutation(() => CreateCustomerResponse)
  updateCustomer(
    @Args('input') input: UpdateCustomerInput,
    @Args('id') customerId: string,
  ) {
    return this.customerService.updateCustomer(input, customerId);
  }

  @Mutation(() => CreateCustomerResponse)
  deleteCustomer(@Args('id') customerId: string) {
    return this.customerService.deleteCustomer(customerId);
  }

  @Query(() => CustomerPaginatedResponse)
  getAllCustomer(@Args('payload') payload: PaginationInput) {
    return this.customerService.getAllCustomer(payload);
  }

  @Query(() => Customer)
  getCustomerById(@Args('id') customerId: string) {
    return this.customerService.getCustomerById(customerId);
  }
}
