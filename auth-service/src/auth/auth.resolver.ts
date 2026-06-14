import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse, User } from './entities/auth.entity';
import { AuthInput } from './dto/auth.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  hello() {
    return 'Hello World!';
  }

  @Mutation(() => User)
  register(@Args('input') authInput: AuthInput) {
    return this.authService.register(authInput);
  }

  @Mutation(() => LoginResponse)
  login(@Args('input') authInput: AuthInput) {
    return this.authService.login(authInput);
  }

  @Mutation(() => User)
  validateToken(@Args('input') token: string) {
    return this.authService.validateToken(token);
  }
}
