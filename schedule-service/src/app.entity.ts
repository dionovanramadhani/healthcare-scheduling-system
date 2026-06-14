import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
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
