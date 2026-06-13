import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CustomerInput {
  @Field()
  name!: string;

  @Field()
  email!: string;
}

@InputType()
export class UpdateCustomerInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;
}

@InputType()
export class PaginationInput {
  @Field({ nullable: true })
  pageNumber?: string;

  @Field({ nullable: true })
  pageSize?: string;
}
