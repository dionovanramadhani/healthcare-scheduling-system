import { PrismaService } from './../prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  async login(authInput: AuthInput) {
    const { email, password } = authInput;

    try {
      // Validate email
      const user = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) throw new UnauthorizedException('User tidak ditemukan!');

      const isPasswordValid = bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new UnauthorizedException('Password salah!');

      // JWT
      const token = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          // password: user.password,
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.prisma.user.findFirst({
        where: {
          id: payload.userId,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) throw new UnauthorizedException('User tidak ditemukan!');

      return user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Token tidak valid!');
    }
  }
}
