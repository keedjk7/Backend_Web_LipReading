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

  @Post('kick_user_team')
  kick_user_team(@Body() managment_team:Managment_team){
    return this.privilegeService.kick_member_team(managment_team);
  }

  @Post('block_user_account')
  async block_user_account(@Body() managment_team:Managment_team){
    const result = await this.privilegeService.block_permission(managment_team);
    if (result.permission == true){
      return this.userService.block_user(result.changed_id)
    }
    else{
      return "403 Forbidden"
    }
  }

  @Post('active_user_account')
  async active_user_account(@Body() managment_team:Managment_team){
    const result = await this.privilegeService.block_permission(managment_team);
    if (result.permission == true){
      return this.userService.active_user(result.changed_id)
    }
    else{
      return "403 Forbidden"
    }
  }

  @Post('block_team')
  async block_team(@Body() managment_team:Managment_team){
    const result = await this.privilegeService.block_permission(managment_team);
    if (result.permission == true){
      return this.teamService.block_team(result.changed_id)
    }
    else{
      return "You don't have permission to block user Account"
    }
  }

  @Post('active_team')
  async active_team(@Body() managment_team:Managment_team){
    const result = await this.privilegeService.block_permission(managment_team);
    if (result.permission == true){
      return this.teamService.active_team(result.changed_id)
    }
    else{
      return "You don't have permission to active user Account"
    }
  }

  @Post('test')
  async test(@Body() test){
    return this.privilegeService.show_team_privilege(test.team_id)
  }

}
