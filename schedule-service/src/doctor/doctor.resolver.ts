import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { Doctor, DoctorPaginatedResponse } from './entities/doctor.entity';
import { DoctorInput } from './dto/doctor.input';
import { PaginationInput } from 'src/dto/app.input';

@Resolver(() => Doctor)
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Mutation(() => Doctor, { description: 'Registers a new doctor with their full name.' })
  createDoctor(
    @Args('input', { description: 'Input data for the new doctor (name)' }) input: DoctorInput,
  ) {
    return this.doctorService.createDoctor(input);
  }

  @Mutation(() => Doctor, { description: 'Updates the information of an already registered doctor.' })
  updateDoctor(
    @Args('input', { description: 'Update data for the doctor (new name)' }) input: DoctorInput,
    @Args('id', { description: 'The ID of the doctor whose data is to be updated' }) id: string,
  ) {
    return this.doctorService.updateDoctor(id, input);
  }

  @Mutation(() => Doctor, { description: 'Deletes a doctor from the system by their ID.' })
  deleteDoctor(
    @Args('id', { description: 'The ID of the doctor to be deleted' }) id: string,
  ) {
    return this.doctorService.deleteDoctor(id);
  }

  @Query(() => Doctor, { description: 'Retrieves a specific doctor by their ID.' })
  getDoctorById(
    @Args('id', { description: 'The ID of the doctor to look up' }) id: string,
  ) {
    return this.doctorService.getDoctorById(id);
  }

  @Query(() => DoctorPaginatedResponse, { description: 'Gets all registered doctors with pagination.' })
  getAllDoctors(
    @Args('payload', { nullable: true, description: 'Pagination parameters (page number and page size)' }) payload?: PaginationInput,
  ) {
    return this.doctorService.getAllDoctors(payload);
  }
}
