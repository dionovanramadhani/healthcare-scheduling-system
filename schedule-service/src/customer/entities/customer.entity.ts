import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { PaginationMeta } from 'src/app.entity';

@ObjectType()
export class Customer {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CreateCustomerResponse {
  @Field()
  message: string;

  @Field()
  data: Customer;
}

@ObjectType()
export class CustomerPaginatedResponse {
  @Field()
  meta: PaginationMeta;

  @Field(() => [Customer])
  data: Customer[];
}
