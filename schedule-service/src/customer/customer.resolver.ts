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

  @Mutation(() => Customer, { description: 'Registers a new customer/patient with a name and email.' })
  createCustomer(
    @Args('input', { description: 'Input data for a new customer (name and email)' }) input: CustomerInput,
  ) {
    return this.customerService.createCustomer(input);
  }

  @Mutation(() => Customer, { description: 'Updates the profile information of an already registered customer/patient.' })
  updateCustomer(
    @Args('input', { description: 'Update data for the customer (name and/or email)' }) input: UpdateCustomerInput,
    @Args('id', { description: 'The ID of the customer to be updated' }) customerId: string,
  ) {
    return this.customerService.updateCustomer(input, customerId);
  }

  @Mutation(() => Customer, { description: 'Deletes a customer by their ID.' })
  deleteCustomer(
    @Args('id', { description: 'The ID of the customer to be deleted' }) customerId: string,
  ) {
    return this.customerService.deleteCustomer(customerId);
  }

  @Query(() => CustomerPaginatedResponse, { description: 'Retrieves all registered customers with pagination.' })
  getAllCustomer(
    @Args('payload', { nullable: true, description: 'Page number and page size parameters (pagination)' }) payload?: PaginationInput,
  ) {
    return this.customerService.getAllCustomer(payload);
  }

  @Query(() => Customer, { description: 'Gets specific data of a single customer by their ID.' })
  getCustomerById(
    @Args('id', { description: 'The ID of the customer to look up' }) customerId: string,
  ) {
    return this.customerService.getCustomerById(customerId);
  }
}
