import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './create-post.dto';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { AuthService } from 'src/auth/auth.service';
import { EditPostDto } from './edit-post.dto';
import * as fs from 'fs';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,private readonly privilegeService: PrivilegeService,private readonly authService: AuthService) {}

  @Post('create')
  async createPost(@Body() createPostDto:CreatePostDto){
    
    // create new post
    const post_info = await this.postService.createPost(createPostDto);

    // add privilege post
    const postPrivilege = {
      user_id : createPostDto.user_id,
      team_id :createPostDto.team_id,
      post_id : post_info.post_id,
      role : 'PostOwner',
    }
    await this.privilegeService.add_privilege(postPrivilege);

    return {
      "status" : "200 OK"
    }
  }

  @Post('edit')
  async editPost(@Body() edit_post_info:EditPostDto){
    // get user_id from token
    const user_id = await this.authService.getUserByToken(edit_post_info.access_token);
    // find user Role by team_id & user_id
    const user_privilege = await this.privilegeService.findPrivilegeByUserAndTeam(user_id,edit_post_info.team_id)
    // console.log(user_privilege)
    // check privilege user
    const permission = await this.privilegeService.privilege_permission(user_privilege.role,'None','edit_post')

    if (permission == false){
      return{
        'status' : '403 Forbidden'
      }
    }
    else{
      // edit and save
      return this.postService.editPost(edit_post_info)
    }    
  }

  @Post('delete')
  async deletePost(@Body() delete_info){
    try{
      console.log(delete_info);
      // get user_id
      const user_id = await this.authService.getUserByToken(delete_info.access_token);
      if (user_id == null){
        return "404 not found user"
      }
      // get user role from that team
      const user_privilege = await this.privilegeService.findPrivilegeByUserAndTeam(user_id,delete_info.team_id);
      console.log(user_privilege);
      const user_role = user_privilege.role;
      if (user_role == null){
        return "404 not found team"
      }
      console.log(user_role);
      // check permission
      const permission = await this.privilegeService.privilege_permission(user_role, null, 'delete_post');
      if (permission == true){
        const post_info = await this.postService.findPostById(delete_info.post_id)

        // Delete previous file if it exists
        await fs.unlinkSync(post_info.file_path);
        await this.privilegeService.delete_post(delete_info.post_id);
        await this.postService.deletePost(delete_info.post_id);
        console.log('delete post success');
        return '200 OK';
      }
      else if(permission ==false){
        console.log('delete post fail');
        return "400 don't have permission";
      }
    }catch(err){
      throw(err)
    }
  }
}