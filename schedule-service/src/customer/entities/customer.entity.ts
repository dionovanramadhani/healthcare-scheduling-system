import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

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
export class PaginationMeta {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  lastPage: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int, { nullable: true })
  prev: number | null;

  @Field(() => Int, { nullable: true })
  next: number | null;
}

@ObjectType()
export class CustomerPaginatedResponse {
  @Field()
  meta: PaginationMeta;

  @Field(() => [Customer])
  data: Customer[];
}
