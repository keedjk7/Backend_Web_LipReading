import { Module, forwardRef } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Video } from './video.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { PostModule } from 'src/post/post.module';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { UsersModule } from 'src/users/users.module';

@Module({  
  imports: [MulterModule.register({
    dest: '../upload'
  }),TypeOrmModule.forFeature([Video]),
  forwardRef(()=>AuthModule),
  forwardRef(()=>UsersModule),
  forwardRef(()=>PostModule),
  forwardRef(()=>PrivilegeModule),
],  
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService]
})
export class VideoModule {}
