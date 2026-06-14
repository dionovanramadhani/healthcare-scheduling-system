import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleInput, SchedulePayload } from './dto/schedule.input';

// Assumption appointment is 30 minutes
const APPOINTMENT_DURATION = 30 * 60 * 1000;

@Injectable()
export class ScheduleService {
  constructor(private db: PrismaService) {}

  async createSchedule(input: ScheduleInput) {
    const { customerId, doctorId, objective, scheduledAt } = input;
    try {
      const scheduledTime = new Date(scheduledAt);
      const startTimeLimit = new Date(
        scheduledTime.getTime() - APPOINTMENT_DURATION,
      );
      const endTimeLimit = new Date(
        scheduledTime.getTime() + APPOINTMENT_DURATION,
      );

      const [validCustomer, validDoctor, scheduleCheck] = await Promise.all([
        // validCustomer
        this.db.customer.findFirst({
          where: {
            id: customerId,
          },
        }),
        // validDoctor
        this.db.doctor.findFirst({
          where: {
            id: doctorId,
          },
        }),
        // scheduleCheck
        this.db.schedule.findFirst({
          where: {
            scheduledAt: {
              gt: startTimeLimit,
              lt: endTimeLimit,
            },
            OR: [{ doctorId }, { customerId }],
          },
        }),
      ]);

      if (!validCustomer)
        throw new NotFoundException('Customer tidak terdaftar!');

      if (!validDoctor) throw new NotFoundException('Doctor tidak terdaftar!');

      if (scheduleCheck)
        throw new BadRequestException(
          scheduleCheck.doctorId === doctorId
            ? 'Dokter sudah memiliki jadwal lain di waktu tersebut'
            : 'Customer sudah memiliki jadwal lain di waktu tersebut',
        );

      return await this.db.schedule.create({
        data: {
          objective,
          scheduledAt,
          customerId,
          doctorId,
        },
        include: {
          customer: true,
          doctor: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message || error);
    }
  }

  async getAllSchedules(payload: SchedulePayload = {}) {
    const { filter, meta } = payload;

    try {
      const page = Number(meta?.pageNumber) || 1;
      const perPage = Number(meta?.pageSize) || 100;
      const skip = page > 0 ? perPage * (page - 1) : 0;

      const [count, schedules] = await Promise.all([
        // count
        this.db.schedule.count({
          where: filter,
        }),
        // schedules
        this.db.schedule.findMany({
          where: filter,
          take: perPage,
          skip,
          include: {
            customer: true,
            doctor: true,
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
        data: schedules,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message || error);
    }
  }

  async getScheduleById(scheduleId: string) {
    try {
      return await this.db.schedule.findFirstOrThrow({
        where: {
          id: scheduleId,
        },
        include: {
          customer: true,
          doctor: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Jadwal appointment tidak ditemukan!');

      throw new InternalServerErrorException(error);
    }
  }

  async deleteSchedule(scheduleId: string) {
    try {
      return await this.db.schedule.delete({
        where: {
          id: scheduleId,
        },
        include: {
          customer: true,
          doctor: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Jadwal appointment tidak ditemukan!');

      throw new InternalServerErrorException(error);
    }
  }

  // create(createScheduleInput: CreateScheduleInput) {
  //   return 'This action adds a new schedule';
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} schedule`;
  // }
  // update(id: number, updateScheduleInput: UpdateScheduleInput) {
  //   return `This action updates a #${id} schedule`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} schedule`;
  // }
}
