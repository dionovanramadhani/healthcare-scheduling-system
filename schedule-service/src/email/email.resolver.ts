import { Query, Resolver } from '@nestjs/graphql';
import { EmailService } from './email.service';
import { Public } from 'src/decorators/public.decorator';

@Resolver(() => String)
export class EmailResolver {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Query(() => String)
  sendEmail() {
    this.emailService.sendEmail({
      to: 'dionovan7@gmail.com',
      customerName: 'Dionovan',
      doctorName: 'Strange',
      scheduledAt: new Date(),
      objective: 'General Checkup',
    });
    return 'Email sent successfully!';
  }
}
