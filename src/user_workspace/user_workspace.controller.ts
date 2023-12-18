import { Body, Controller, Post } from '@nestjs/common';
import { UserWorkspaceService } from './user_workspace.service';

@Controller('userWorkSpace')
export class UserWorkspaceController {
  constructor(private readonly userWorkspaceService: UserWorkspaceService) {}

  @Post('work_space')
  async work_space(@Body() token){
    console.log(token)
    return await this.userWorkspaceService.work_space(token.access_token)
    
  }
}
