import { InputType, Field, PartialType } from '@nestjs/graphql';
import { PaginationInput } from 'src/dto/app.input';

@InputType()
export class ScheduleInput {
  @Field()
  objective: string;

  @Field(() => Date)
  scheduledAt: Date;

  @Field()
  customerId: string;

  @Field()
  doctorId: string;
}

@InputType()
export class ScheduleFilterInput extends PartialType(ScheduleInput) {}

@InputType()
export class SchedulePayload {
  @Field(() => ScheduleFilterInput, { nullable: true })
  filter?: ScheduleFilterInput;

  @Field(() => PaginationInput, { nullable: true })
  meta?: PaginationInput;
}

