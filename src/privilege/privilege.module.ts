import { Module, forwardRef } from '@nestjs/common';
import { PrivilegeService } from './privilege.service';
import { PrivilegeController } from './privilege.controller';
import { UsersModule } from 'src/users/users.module';
import { TeamModule } from 'src/team/team.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(()=>AuthModule), 
    forwardRef(()=>UsersModule), 
    forwardRef(()=>TeamModule)
  ],
  controllers: [PrivilegeController],
  providers: [PrivilegeService],
  exports: [PrivilegeService],
})
export class PrivilegeModule {}
