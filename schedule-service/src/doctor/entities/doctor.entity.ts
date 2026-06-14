import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PaginationMeta } from 'src/app.entity';

@ObjectType()
export class Doctor {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class DoctorPaginatedResponse {
  @Field()
  meta: PaginationMeta;

  @Field(() => [Doctor])
  data: Doctor[];
}
