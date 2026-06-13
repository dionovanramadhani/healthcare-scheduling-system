import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CustomerInput,
  PaginationInput,
  UpdateCustomerInput,
} from './dto/create-customer.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private db: PrismaService) {}

  async createCustomer(customerInput: CustomerInput) {
    const { email, name } = customerInput;

    if (!email || !name)
      throw new BadRequestException('Email dan nama harus diisi!');

    try {
      const customerIsExist = await this.db.customer.findFirst({
        where: {
          email,
        },
      });

      if (customerIsExist)
        throw new BadRequestException('User ini sudah terdaftar');

      const newCustomer = await this.db.customer.create({
        data: customerInput,
      });

      return {
        message: 'Successfully add new customer',
        data: newCustomer,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateCustomer(customerInput: UpdateCustomerInput, customerId: string) {
    const { name, email } = customerInput;

    try {
      const findCustomer = await this.db.customer.findFirst({
        where: {
          id: customerId,
        },
      });

      if (!findCustomer)
        throw new NotFoundException('Customer tidak ditemukan');

      const emailIsUsed = await this.db.customer.findFirst({
        where: {
          email,
        },
      });

      if (emailIsUsed) throw new BadRequestException('Email sudah terpakai!');

      const updatedCustomer = await this.db.customer.update({
        where: {
          id: customerId,
        },
        //  ...(referralCode && { referralCode: referralCode }),
        data: {
          ...(name && { name: name }),
          ...(email && { email: email }),
        },
      });

      return {
        message: 'Successfully update customer data',
        data: updatedCustomer,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllCustomer(payload: PaginationInput) {
    const { pageNumber, pageSize } = payload;

    try {
      const count = await this.db.customer.count();

      const page = Number(pageNumber) || 1;
      const perPage = Number(pageSize) || 100;
      const skip = page > 0 ? perPage * (page - 1) : 0;
      const lastPage = Math.ceil(count / perPage);

      const customer = await this.db.customer.findMany({
        take: perPage,
        skip,
      });

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
      const customer = await this.db.customer.findFirst({
        where: {
          id: customerId,
        },
      });
      if (!customer) throw new NotFoundException('Customer tidak ditemukan!');

      return customer;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteCustomer(customeerId: string) {
    try {
      const customerExist = await this.db.customer.findFirst({
        where: { id: customeerId },
      });
      if (!customerExist)
        throw new NotFoundException('Customer tidak ditemukan!');

      const deleteCustomer = await this.db.customer.delete({
        where: {
          id: customeerId,
        },
      });

      return {
        message: 'Successfully delete customer',
        data: deleteCustomer,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
