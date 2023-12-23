import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { TeamModule } from 'src/team/team.module';
import { AuthModule } from 'src/auth/auth.module';
import { VideoModule } from 'src/video/video.module';

@Module({
  imports: [
    forwardRef(()=>PrivilegeModule), 
    forwardRef(()=>TeamModule), 
    forwardRef(()=>AuthModule),
    forwardRef(()=>VideoModule), 
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
