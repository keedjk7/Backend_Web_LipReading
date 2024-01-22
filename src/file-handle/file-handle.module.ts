import { Module } from '@nestjs/common';
import { FileHandleService } from './file-handle.service';
import { FileHandleController } from './file-handle.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './user_profile_image/',  // Set the destination folder
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix);
        },
      }),
    }),
  ],
  controllers: [FileHandleController],
  providers: [FileHandleService],
  exports: [FileHandleService],
})
export class FileHandleModule {}
