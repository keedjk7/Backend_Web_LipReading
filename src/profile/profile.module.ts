import { Module, forwardRef } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { FileHandleModule } from 'src/file-handle/file-handle.module';

@Module({
  imports: [
    forwardRef(()=>AuthModule),
    forwardRef(()=>UsersModule),
    forwardRef(()=>FileHandleModule),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
