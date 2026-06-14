import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { Doctor, DoctorPaginatedResponse } from './entities/doctor.entity';
import { DoctorInput } from './dto/doctor.input';
import { PaginationInput } from 'src/dto/app.input';

@Resolver(() => Doctor)
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Mutation(() => Doctor)
  createDoctor(@Args('input') input: DoctorInput) {
    return this.doctorService.createDoctor(input);
  }

  @Mutation(() => Doctor)
  updateDoctor(@Args('input') input: DoctorInput, @Args('id') id: string) {
    return this.doctorService.updateDoctor(id, input);
  }

  @Mutation(() => Doctor)
  deleteDoctor(@Args('id') id: string) {
    return this.doctorService.deleteDoctor(id);
  }

  @Query(() => Doctor)
  getDoctorById(@Args('id') id: string) {
    return this.doctorService.getDoctorById(id);
  }

  @Query(() => DoctorPaginatedResponse)
  getAllDoctors(@Args('payload', { nullable: true }) payload?: PaginationInput) {
    return this.doctorService.getAllDoctors(payload);
  }
}
