import { Module, forwardRef } from '@nestjs/common';
import { TeamPostPageService } from './team_post_page.service';
import { TeamPostPageController } from './team_post_page.controller';
import { VideoModule } from 'src/video/video.module';
import { PostModule } from 'src/post/post.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(()=>VideoModule),
    forwardRef(()=>PostModule),
    forwardRef(()=>AuthModule),
    forwardRef(()=>PrivilegeModule),
    forwardRef(()=>UsersModule),
  ],
  controllers: [TeamPostPageController],
  providers: [TeamPostPageService],
  exports: [TeamPostPageService],
})
export class TeamPostPageModule {}
