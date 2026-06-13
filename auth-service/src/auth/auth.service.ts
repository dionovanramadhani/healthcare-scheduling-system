import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthInput } from './dto/create-auth.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(authInput: AuthInput) {
    const { email, password } = authInput;

    // Check existing user
    const userIsExist = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userIsExist) throw new BadRequestException('Email ini sudah terdaftar');

    const hashPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
      },
    });
  }
}
