import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  pageNumber?: number;

  @Field(() => Int, { nullable: true })
  pageSize?: number;
}
