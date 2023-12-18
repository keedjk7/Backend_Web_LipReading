import { Module, forwardRef } from '@nestjs/common';
import { UserWorkspaceService } from './user_workspace.service';
import { UserWorkspaceController } from './user_workspace.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TeamModule } from 'src/team/team.module';
import { VideoModule } from 'src/video/video.module';
import { PrivilegeModule } from 'src/privilege/privilege.module';

@Module({
  imports: [
    forwardRef(()=>AuthModule), 
    forwardRef(()=>TeamModule), 
    forwardRef(()=>PrivilegeModule), 
    forwardRef(()=>VideoModule)
  ],
  controllers: [UserWorkspaceController],
  providers: [UserWorkspaceService],
})
export class UserWorkspaceModule {}
