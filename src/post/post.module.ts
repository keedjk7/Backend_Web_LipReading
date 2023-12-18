import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { TeamModule } from 'src/team/team.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(()=>PrivilegeModule), 
    forwardRef(()=>TeamModule), 
    forwardRef(()=>AuthModule)
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
