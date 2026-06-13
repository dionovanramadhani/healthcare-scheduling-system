import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    let request;
    if (context.getType().toString() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;

      const info = gqlContext.getInfo();
      if (info && info.fieldName === '__schema') {
        return true;
      }
    } else {
      request = context.switchToHttp().getRequest();
    }

    const authHeader = request?.headers?.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Invalid authorization format. Use Bearer <token>',
      );
    }

    const user = await this.validateToken(token);

    request.user = user;
    return true;
  }

  private async validateToken(token: string) {
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001/';

    try {
      const response = await fetch(authServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation ValidateToken($token: String!) {
              validateToken(input: $token) {
                id
                email
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            token,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect with auth-service');
      }

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message || 'Token is not active');
      }

      const user = result.data?.validateToken;
      if (!user) {
        throw new Error('User payload not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException(
        error.message || 'Token validation failed',
      );
    }
  }
}
