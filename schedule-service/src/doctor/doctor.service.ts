import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DoctorInput } from './dto/doctor.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationInput } from 'src/dto/app.input';

@Injectable()
export class DoctorService {
  constructor(private db: PrismaService) {}

  async createDoctor(doctorInput: DoctorInput) {
    try {
      return await this.db.doctor.create({
        data: doctorInput,
        include: {
          schedules: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateDoctor(id: string, input: DoctorInput) {
    try {
      return await this.db.doctor.update({
        where: { id },
        data: input,
        include: {
          schedules: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Dokter tidak ditemukan');

      throw new InternalServerErrorException(error);
    }
  }

  async getDoctorById(id: string) {
    try {
      return await this.db.doctor.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          schedules: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Dokter tidak ditemukan');

      throw new InternalServerErrorException(error);
    }
  }

  async getAllDoctors(payload: PaginationInput = {}) {
    const { pageNumber, pageSize } = payload;

    try {
      const page = Number(pageNumber) || 1;
      const perPage = Number(pageSize) || 100;
      const skip = page > 0 ? perPage * (page - 1) : 0;

      const [count, doctors] = await Promise.all([
        //  count
        this.db.doctor.count(),
        // doctors
        this.db.doctor.findMany({
          take: perPage,
          skip,
          include: {
            schedules: true,
          },
        }),
      ]);

      const lastPage = Math.ceil(count / perPage);

      return {
        meta: {
          total: count,
          lastPage,
          currentPage: page,
          pageSize: perPage,
          prev: page > 1 ? page - 1 : null,
          next: page < lastPage ? page + 1 : null,
        },
        data: doctors,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteDoctor(id: string) {
    try {
      return await this.db.doctor.delete({
        where: {
          id,
        },
        include: {
          schedules: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Dokter tidak ditemukan');

      throw new InternalServerErrorException(error);
    }
  }
}
