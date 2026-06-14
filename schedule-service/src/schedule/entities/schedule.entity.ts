import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PaginationMeta } from 'src/app.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';

@ObjectType()
export class Schedule {
  @Field()
  id: string;

  @Field()
  objective: string;

  @Field()
  scheduledAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  customerId: string;

  @Field()
  doctorId: string;

  @Field(() => Customer)
  customer: Customer;

  @Field(() => Doctor)
  doctor: Doctor;
}

@ObjectType()
export class PaginatedScheduleResponse {
  @Field()
  meta: PaginationMeta;

  @Field(() => [Schedule])
  data: Schedule[];
}
