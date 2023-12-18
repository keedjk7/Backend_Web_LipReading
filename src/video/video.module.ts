import { Module, forwardRef } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Video } from './video.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({  
  imports: [MulterModule.register({
    dest: '../upload'
  }),TypeOrmModule.forFeature([Video]),
  forwardRef(()=>AuthModule)
],  
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService]
})
export class VideoModule {}
