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
