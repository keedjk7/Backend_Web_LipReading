import { Module, forwardRef } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PostModule } from 'src/post/post.module';
import { VideoModule } from 'src/video/video.module';
import { FileHandleModule } from 'src/file-handle/file-handle.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    forwardRef(()=>PrivilegeModule), 
    forwardRef(()=>UsersModule), 
    forwardRef(()=>AuthModule),
    forwardRef(()=>PostModule),
    forwardRef(()=>VideoModule),
    forwardRef(()=>FileHandleModule),
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
