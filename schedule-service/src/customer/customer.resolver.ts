import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import {
  CreateCustomerResponse,
  Customer,
  CustomerPaginatedResponse,
} from './entities/customer.entity';
import {
  CustomerInput,
  UpdateCustomerInput,
} from './dto/create-customer.input';
import { PaginationInput } from 'src/dto/app.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Mutation(() => Customer)
  createCustomer(@Args('input') input: CustomerInput) {
    return this.customerService.createCustomer(input);
  }

  @Mutation(() => Customer)
  updateCustomer(
    @Args('input') input: UpdateCustomerInput,
    @Args('id') customerId: string,
  ) {
    return this.customerService.updateCustomer(input, customerId);
  }

  @Mutation(() => Customer)
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
