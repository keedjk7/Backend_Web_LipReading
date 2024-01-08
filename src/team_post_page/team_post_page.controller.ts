import { Body, Controller, Post } from '@nestjs/common';
import { TeamPostPageService } from './team_post_page.service';
import { TeamPostPageDto } from './team_post_page.dto';

@Controller('team-post-page')
export class TeamPostPageController {
  constructor(private readonly teamPostPageService: TeamPostPageService) {}

  @Post('')
  async getFrame(@Body() teamPostPageDto:TeamPostPageDto){
    console.log(teamPostPageDto)
    const data = await this.teamPostPageService.getTeamPostPage(teamPostPageDto);

    return data
    // return await this.userWorkspaceService.work_space(token.access_token)
    
  }
}
