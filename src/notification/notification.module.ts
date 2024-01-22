import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { TeamModule } from 'src/team/team.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(()=>AuthModule),
    forwardRef(()=>UsersModule),
    forwardRef(()=>TeamModule),
    forwardRef(()=>PrivilegeModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports:[NotificationService]
})
export class NotificationModule {}
