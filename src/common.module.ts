import { Module } from '@nestjs/common';
import { UserWorkspaceModule } from 'src/user_workspace/user_workspace.module';

@Module({
  imports: [UserWorkspaceModule],
  exports: [UserWorkspaceModule],
})
export class CommonModule {}