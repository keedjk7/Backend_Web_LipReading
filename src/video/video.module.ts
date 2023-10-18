import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({  
  imports: [MulterModule.register({
    dest: '../upload'
  })
],  
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService]
})
export class VideoModule {}
