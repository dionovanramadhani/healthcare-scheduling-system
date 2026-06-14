import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse, User } from './entities/auth.entity';
import { AuthInput } from './dto/auth.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String, { description: 'A simple query to check if the service is running correctly.' })
  hello() {
    return 'Hello World!';
  }

  @Mutation(() => User, { description: 'Registers a new user with email and password.' })
  register(
    @Args('input', { description: 'Input data for user registration (email and password)' }) authInput: AuthInput,
  ) {
    return this.authService.register(authInput);
  }

  @Mutation(() => LoginResponse, { description: 'Logs in a user and returns a JWT access token.' })
  login(
    @Args('input', { description: 'Input data for user login (email and password)' }) authInput: AuthInput,
  ) {
    return this.authService.login(authInput);
  }

  @Mutation(() => User, { description: 'Validates a JWT access token and returns user information if the token is valid.' })
  validateToken(
    @Args('input', { description: 'The JWT token string to be validated' }) token: string,
  ) {
    return this.authService.validateToken(token);
  }
}
