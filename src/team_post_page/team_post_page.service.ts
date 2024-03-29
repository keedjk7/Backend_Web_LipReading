import { Injectable } from '@nestjs/common';
import { TeamPostPageDto } from './team_post_page.dto';
import { AuthService } from 'src/auth/auth.service';
import { VideoService } from 'src/video/video.service';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { PostService } from 'src/post/post.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TeamPostPageService {
    constructor(
        private usersService : UsersService,
        private postService : PostService,
        private privilegeService : PrivilegeService,
        private authService : AuthService,
        private videoService : VideoService
    ){}
    
    async getTeamPostPage(teamPostPageDto: TeamPostPageDto) {
        //userid from token
        const user_id = await this.authService.getUserByToken(teamPostPageDto.access_token);
        // get Role from userid and team_id
        const user_privilege_info = await this.privilegeService.findPrivilegeByUserAndTeam(user_id, teamPostPageDto.team_id);
        // get user info from user_id
        const user_info = await this.usersService.findById(user_id)
        // post info from post_id
        const post_info = await this.postService.findPostById(teamPostPageDto.post_id)
        // find video_id from post_id
        const video_id = (await this.postService.findPostById(teamPostPageDto.post_id)).video_id
        // get video entity
        const video = await this.videoService.findFromId(video_id)
        // // get file base 64 from video_id
        // const base64Video = await this.videoService.download_origin(video_id,user_id)
        // subtitle eng,thai
        const videoFrameData = await this.videoService.getVideoFrame(video_id);
        const subtitle_eng = await videoFrameData.sub_eng;
        const subtitle_thai = videoFrameData.sub_thai;

        console.log(videoFrameData,subtitle_eng)
        // // subtitle thai
        // const subtitle_th = await this.videoService.translate_thai(subtitle_eng)

        // console.log(base64Video)

        const data = {
            role: user_privilege_info.role,
            user_image: user_info.profile_image.substring(user_info.profile_image.lastIndexOf('/')+1),
            team_id: teamPostPageDto.team_id,
            post_id: teamPostPageDto.post_id,
            post_user: user_info.username,
            post_date: post_info.createAt,
            post_description: post_info.post_description,
            video_path: video.product_path.substring(video.product_path.lastIndexOf('/')+1),
            video_id: video_id,
            subtitle_eng: subtitle_eng,
            subtitle_thai: subtitle_thai,
            status: "200 OK"
        }
        console.log(data)

        return data
    }
    
}
