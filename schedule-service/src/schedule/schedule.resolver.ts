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

  @Mutation(() => Schedule, { description: 'Creates a new schedule between a customer and a doctor. Automatically checks for schedule conflicts.' })
  createSchedule(
    @Args('input', { description: 'Input data for creating a new schedule (customer ID, doctor ID, objective, and scheduled time)' }) input: ScheduleInput,
  ) {
    return this.scheduleService.createSchedule(input);
  }

  @Mutation(() => Schedule, { description: 'Deletes a schedule by its ID.' })
  deleteSchedule(
    @Args('id', { description: 'The ID of the schedule to be deleted' }) scheduleId: string,
  ) {
    return this.scheduleService.deleteSchedule(scheduleId);
  }

  @Query(() => PaginatedScheduleResponse, { description: 'Gets all schedules with pagination and optional filters.' })
  getAllSchedules(
    @Args('payload', { nullable: true, description: 'Pagination, search, and filter parameters for schedules' }) payload?: SchedulePayload,
  ) {
    return this.scheduleService.getAllSchedules(payload);
  }

  @Query(() => Schedule, { description: 'Gets details of a specific schedule by its ID.' })
  getScheduleById(
    @Args('id', { description: 'The ID of the schedule to retrieve' }) scheduleId: string,
  ) {
    return this.scheduleService.getScheduleById(scheduleId);
  }
}
