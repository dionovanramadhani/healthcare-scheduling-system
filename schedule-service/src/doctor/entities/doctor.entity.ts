import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PaginationMeta } from 'src/app.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';

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

  @Field(() => [Schedule])
  schedules: Schedule[];
}

@ObjectType()
export class DoctorPaginatedResponse {
  @Field()
  meta: PaginationMeta;

  @Field(() => [Doctor])
  data: Doctor[];
}
