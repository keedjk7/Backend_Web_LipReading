import { Module, forwardRef } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    forwardRef(()=>PrivilegeModule), 
    forwardRef(()=>UsersModule), 
    forwardRef(()=>AuthModule),
    forwardRef(()=>PostModule)
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
