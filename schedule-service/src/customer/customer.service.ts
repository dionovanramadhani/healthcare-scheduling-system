import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CustomerInput,
  UpdateCustomerInput,
} from './dto/create-customer.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationInput } from 'src/dto/app.input';

@Injectable()
export class CustomerService {
  constructor(private db: PrismaService) {}

  async createCustomer(customerInput: CustomerInput) {
    const { email, name } = customerInput;

    if (!email || !name)
      throw new BadRequestException('Email dan nama harus diisi!');

    try {
      return await this.db.customer.create({
        data: customerInput,
        include: {
          schedules: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('Customer ini sudah terdaftar');

      throw new InternalServerErrorException(error);
    }
  }

  async updateCustomer(customerInput: UpdateCustomerInput, customerId: string) {
    const { name, email } = customerInput;

    try {
      return await this.db.customer.update({
        where: {
          id: customerId,
        },
        data: {
          ...(name && { name: name }),
          ...(email && { email: email }),
        },
        include: {
          schedules: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Customer tidak ditemukan!');

      if (error.code === 'P2002')
        throw new BadRequestException('Email sudah terpakai!');

      throw new InternalServerErrorException(error);
    }
  }

  async getAllCustomer(payload: PaginationInput = {}) {
    const { pageNumber, pageSize } = payload;

    try {
      const page = Number(pageNumber) || 1;
      const perPage = Number(pageSize) || 100;
      const skip = page > 0 ? perPage * (page - 1) : 0;

      const [count, customer] = await Promise.all([
        // count
        this.db.customer.count(),
        // customer
        this.db.customer.findMany({
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
        data: customer,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getCustomerById(customerId: string) {
    try {
      return await this.db.customer.findFirstOrThrow({
        where: {
          id: customerId,
        },
        include: {
          schedules: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Customer tidak ditemukan!');

      throw new InternalServerErrorException(error);
    }
  }

  async deleteCustomer(customerId: string) {
    try {
      return await this.db.customer.delete({
        where: {
          id: customerId,
        },
        include: {
          schedules: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Customer tidak ditemukan!');

      throw new InternalServerErrorException(error);
    }
  }
}
