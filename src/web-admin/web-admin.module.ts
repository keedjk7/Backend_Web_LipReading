import { Module, forwardRef } from '@nestjs/common';
import { WebAdminService } from './web-admin.service';
import { WebAdminController } from './web-admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { UsersModule } from 'src/users/users.module';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [
    forwardRef(()=>AuthModule),
    forwardRef(()=>UsersModule),
    forwardRef(()=>TeamModule),
    forwardRef(()=>PrivilegeModule),
  ],
  controllers: [WebAdminController],
  providers: [WebAdminService],
})
export class WebAdminModule {}
