import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ScheduleService } from './schedule.service';
import {
  PaginatedScheduleResponse,
  Schedule,
} from './entities/schedule.entity';
import { ScheduleInput, SchedulePayload } from './dto/schedule.input';

@Resolver(() => Schedule)
export class ScheduleResolver {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Mutation(() => Schedule)
  createSchedule(@Args('input') input: ScheduleInput) {
    return this.scheduleService.createSchedule(input);
  }

  @Mutation(() => Schedule)
  deleteSchedule(@Args('id') scheduleId: string) {
    return this.scheduleService.deleteSchedule(scheduleId);
  }

  @Query(() => PaginatedScheduleResponse)
  getAllSchedules(
    @Args('payload', { nullable: true }) payload?: SchedulePayload,
  ) {
    return this.scheduleService.getAllSchedules(payload);
  }

  @Query(() => Schedule)
  getScheduleById(@Args('id') scheduleId: string) {
    return this.scheduleService.getScheduleById(scheduleId);
  }
}
