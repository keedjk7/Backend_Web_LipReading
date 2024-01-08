import { Body, Controller, Post, Req } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './create-team.dto';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { EditTeamDto } from './edit-team.dto';

import * as fs from 'fs';
import { PostService } from 'src/post/post.service';
import { VideoService } from 'src/video/video.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService,private readonly authService: AuthService,
    private readonly usersService: UsersService,private readonly privilegeService: PrivilegeService,private readonly postService: PostService,
    private readonly videoService: VideoService) {}

  @Post('create')
  async create_team(@Body()createTeamDto:CreateTeamDto){
    // check toke to get team owner
    const user_id = await this.authService.getUserByToken(createTeamDto.access_token);
    if(user_id == null){
      return '500 wrong with token'
    }
    const team_id = await this.teamService.create_team(createTeamDto);
    console.log('team_id',team_id)
    // add owner to privilege
    const createPrivilegeDto_owner = {
      team_id : team_id,
      user_id : user_id,
      role : 'Owner',
      post_id : 0
    }
    await this.privilegeService.add_privilege(createPrivilegeDto_owner);
    console.log('save privilege owner')
    // add member to privilege
    for (let i = 0; i < createTeamDto.member.length; i++){
      // find user_id by Email
      let user = await this.usersService.findByEmail(createTeamDto.member[i].Email);
      let createPrivilegeDto_member = {
        team_id : team_id,
        user_id : user.id,
        role : createTeamDto.member[i].Role,
        post_id : 0
      }
      // add privilege
      await this.privilegeService.add_privilege(createPrivilegeDto_member);
    }
    
    return '200 OK';
  }


  @Post('delete')
  async delete_team(@Body() delete_info){
    try{
      console.log(delete_info);
      // get user_id
      const user_id = await this.authService.getUserByToken(delete_info.access_token);
      if (user_id == null){
        return "404 not found user"
      }
      // get user role from that team
      const user_privilege = this.privilegeService.findPrivilegeByUserAndTeam(user_id,delete_info.team_id);
      console.log(user_privilege);
      const user_role = (await user_privilege).role;
      if (user_role == null){
        return "404 not found team"
      }
      console.log(user_role);
      // check permission
      const permission = await this.privilegeService.privilege_permission(user_role, null, 'delete_team');
      if (permission == true){
        const team_info = await this.teamService.TeamfindById(delete_info.team_id)
        // Delete previous image file if it exists
        await fs.unlinkSync(team_info.picture_team);
        await this.privilegeService.delete_team(delete_info.team_id);
        await this.teamService.delete_team(delete_info.team_id);
        console.log('delete team success');
        return '200 OK';
      }
      else if(permission ==false){
        console.log('delete team fail');
        return "400 don't have permission";
      }
    }catch(err){
      throw(err)
    }
  }


  // call edit teamPage
  @Post('editTeam')
  async editTeam(@Body() getInfo){
    // get user_id from token
    const user_id = await this.authService.getUserByToken(getInfo.access_token);
    // find user Role by team_id & user_id
    const user_privilege = await this.privilegeService.findPrivilegeByUserAndTeam(user_id,getInfo.team_id)
    // get team_info by team_id
    const team_info = await this.teamService.TeamfindById(getInfo.team_id);
    const base64String = await this.teamService.imageToBase64(team_info.picture_team);

    return {
      'status' : '200 OK',
      'team_name' : team_info.team_name,
      'team_image' : base64String,
      'team_desc' : team_info.team_description,
      'user_role' : user_privilege.role
    }
  }

  // edit team
  @Post('saveTeamInfo')
  async saveTeamInfo(@Body() edit_team_info:EditTeamDto){
    console.log(edit_team_info)
    // get user_id from token
    const user_id = await this.authService.getUserByToken(edit_team_info.access_token);
    // find user Role by team_id & user_id
    const user_privilege = await this.privilegeService.findPrivilegeByUserAndTeam(user_id,edit_team_info.team_id)
    // console.log(user_privilege)
    // check privilege user
    const permission = await this.privilegeService.privilege_permission(user_privilege.role,'None','edit_team')

    if (permission == false){
      return{
        'status' : '403 Forbidden'
      }
    }
    else{
      // edit and save
      return this.teamService.edit_save(edit_team_info)
    }    
  }

  // @Post('searchInTeam')
  // async searchInTeam(@Body() getInfo){
  //   // check username in team
  //   console.info(getInfo)
  //   const members =  await this.privilegeService.findMemberInTeam(getInfo.team_id)

  //   try {
  //     const users = await this.usersService.searchUsersByText(getInfo.textSearch);
  //     return { users };
  //   } catch (error) {
  //     return { error: 'An error occurred while fetching users' };
  //   }
  
  //   return members;
  // }

  // teamWebPage
  @Post('teamWebPage')
  async teamWebPage(@Body() info){
    console.log("info show",info,"end")
     // get user_id from token
     const user_id = await this.authService.getUserByToken(info.access_token);

     const user_info = await this.privilegeService.findPrivilegeByUserAndTeam(user_id,info.team_id);

    //  get team info from team_id
    const team_info = await this.teamService.TeamfindById(info.team_id);

    console.log(team_info)

    //  team image to base 64
    const team_picture = await this.teamService.imageToBase64(team_info.picture_team);

    // count member in team
    const count_member = (await this.privilegeService.countMemberTeam(info.team_id)).count_member;
    // // all member in team
    // const members = await this.privilegeService.findMemberInTeam(info.team_id)
    
    // all team that this member in
    const teams = await this.privilegeService.findTeamByUser(user_id);

    const teams_info = [];
      // get each user info
      for(let i=0;i<teams.length;i++){
        const info_loop = await this.teamService.TeamfindById(teams[i].team_id);

        const imageBase64 = await this.teamService.imageToBase64(info_loop.picture_team);

        const edit_info = {
          'team_id' : info_loop.team_id,
          // picture
          'team_name' : info_loop.team_name,
          'image_content' : imageBase64
        }

        teams_info.push(edit_info);
      }

      // post in this team
      const posts_privilege = await this.privilegeService.findPostByTeamId(info.team_id);
      const posts_info = [];
      // get each user info
      for(let i=0;i<posts_privilege.length;i++){
        const info = await this.postService.findPostById(posts_privilege[i].post_id);

        console.log(posts_privilege,info)

        // get file path from video_id 
        // const path = (await this.videoService.findFromId(info.video_id)).product_path;

        // const fileBase64 = await this.teamService.imageToBase64(path);
        const user = (await this.usersService.findById(posts_privilege[i].user_id))
        console.log(user)
        const username = user.username
        
        const edit_info = {
          'user_id' : posts_privilege[i].user_id,
          'Post_user' : username,
          'Post_id' : posts_privilege[i].post_id,
          'Post_Date' : info.createAt,
          // 'Post_image' : fileBase64,
          'Post_description' : info.post_description
        }

        posts_info.push(edit_info);
      }
      console.log("--------end webPage--------")

      // merge all
      return{
        'user_id' : user_id,
        'role' : user_info.role,
        'team_id' : team_info.team_id,
        'team_name' : team_info.team_name,
        'team_description' : team_info.team_description,
        'team_picture' : team_picture,
        'team_count_member' : count_member,
        'teams' : teams_info,
        // แก้ post
        // 'posts' : posts_info
        'posts' : posts_info
      }
  }

  // call Team Management Member
  @Post('getManagment')
  async Managment(@Body() getInfo){
    console.log(getInfo)
    // get user_id from token
    const user_id = await this.authService.getUserByToken(getInfo.access_token);
    // get role
    const user_privilege_info = await this.privilegeService.findPrivilegeByUserAndTeam(user_id,getInfo.team_id);
    // check permission privilege user role
    const user_privilege = await this.privilegeService.findPrivilegeByUserAndTeam(user_id,getInfo.team_id);
    const permission = await this.privilegeService.privilege_permission(user_privilege.role,'None','edit_team');

    if (permission == false){
      return{
        'status' : '403 Forbidden'
      }
    }
    else{
      const memberPrivilege = await this.privilegeService.show_team_privilege(getInfo.team_id);
      console.log('---------------')
      console.log(memberPrivilege)
      const members = [];

      // get each user info
      for(let i=0;i<memberPrivilege.length;i++){
        console.log(memberPrivilege[i])
        // console.log(memberPrivilege[i].user_id)
        const member_info = await this.usersService.findById(memberPrivilege[i].user_id);
        console.log('loop',member_info)
        
        const edit_info = {
          user_id : member_info.id,
          // member picture ยังไม่ได้ทำส่วนนี้
          member_name : member_info.username,
          Role : memberPrivilege[i].role
        }

        members.push(edit_info);
      }
      console.log('----',memberPrivilege.length,members)

      return{
        'role' : user_privilege_info.role,
        // มีส่งรูป
        'count_member' : memberPrivilege.length,
        'member' : members,
        'status' : '200 OK'
      }
    }
  }

  // @Post('add_member')
  // invite_member(@Body() reqAdd){
  //   return this.teamService.add_member(reqAdd);
  // }
}
