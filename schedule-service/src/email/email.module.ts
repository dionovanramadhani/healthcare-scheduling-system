import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailResolver } from './email.resolver';

@Global()
@Module({
  exports: [EmailService],
  providers: [EmailService, EmailResolver],
})
export class EmailModule {}
