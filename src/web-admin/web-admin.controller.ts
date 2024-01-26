import { Body, Controller, Post } from '@nestjs/common';
import { WebAdminService } from './web-admin.service';
import { Managment_team } from 'src/privilege/managment-team.dto';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { UsersService } from 'src/users/users.service';

@Controller('web-admin')
export class WebAdminController {
  constructor(private readonly webAdminService: WebAdminService) {}

  @Post('user_getAllUserInfo')
  async getAllUserInfo(@Body() token){
    // get user info
    return this.webAdminService.getAllUserInfo(token.access_token)
  }

  @Post('user_editUser')
  async change_role(@Body() body:any){
    // edit status user
    return this.webAdminService.editStatusUser(body)
  }

  @Post('team_getAllTeamInfo')
  async getAllTeamInfo(@Body() token){
    // get user info
    return this.webAdminService.getAllTeamInfo(token.access_token)
  }

  @Post('team_editTeam')
  async editTeam(@Body() body:any){
    // get user info
    return this.webAdminService.editStatusTeam(body)
  }

  @Post('check-web-admin')
  async check_web_admin(@Body() token){
    const user = await this.webAdminService.checkWebAdmin(token.access_token)

    if(user == 'WebAdmin'){
      return '200 OK WebAdmin'
    }
    else{
      return '200 OK User'
    }
  }

}
