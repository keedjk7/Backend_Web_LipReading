import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrivilegeService } from './privilege.service';
import { CreatePrivilegeDto } from './create-privilege.dto';
import { Managment_team } from './managment-team.dto';
import { UsersService } from 'src/users/users.service';
import { TeamService } from 'src/team/team.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('privilege')
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService,private readonly userService: UsersService,private readonly teamService: TeamService) {}
 
  @Post('searchInTeam')
  async searchInTeam(@Body() getInfo){
    // check username in team
    console.info(getInfo)
    const members =  await this.privilegeService.findMemberInTeam(getInfo.team_id)
  
    return members;
  }

  
  @Post('add_member')
  add_member(@Body() createPrivilegeDto : CreatePrivilegeDto){
    return this.privilegeService.add_privilege(createPrivilegeDto);
  }

  @Post('change_role')
  change_role(@Body() managment_team:Managment_team){
    return this.privilegeService.change_role(managment_team);
  }

  @Post('UserleftTeam')
  leftTeam(@Body() body){
    return this.privilegeService.user_left_team(body.access_token,body.team_id);
  }

  @Post('kick_user_from_team')
  kick_user_team(@Body() managment_team:Managment_team){
    return this.privilegeService.kick_member_team(managment_team);
  }

  @Post('Offline_user_account')
  async Offline_user_account(@Body() managment_team:Managment_team){
    const result = await this.privilegeService.Offline_permission(managment_team);
    if (result.permission == true){
      return this.userService.Offline_user(result.changed_id)
    }
    else{
      return "403 Forbidden"
    }
  }

  @Post('Online_user_account')
  async Online_user_account(@Body() managment_team:Managment_team){
    const result = await this.privilegeService.Offline_permission(managment_team);
    if (result.permission == true){
      return this.userService.Online_user(result.changed_id)
    }
    else{
      return "403 Forbidden"
    }
  }

  @Post('Offline_team')
  async Offline_team(@Body() managment_team:Managment_team){
    const result = await this.privilegeService.Offline_permission(managment_team);
    if (result.permission == true){
      return this.teamService.Offline_team(result.changed_id)
    }
    else{
      return "You don't have permission to Offline user Account"
    }
  }

  @Post('Online_team')
  async Online_team(@Body() managment_team:Managment_team){
    const result = await this.privilegeService.Offline_permission(managment_team);
    if (result.permission == true){
      return this.teamService.Online_team(result.changed_id)
    }
    else{
      return "You don't have permission to Online user Account"
    }
  }

  @Post('test')
  async test(@Body() test){
    return this.privilegeService.show_team_privilege(test.team_id)
  }

}
