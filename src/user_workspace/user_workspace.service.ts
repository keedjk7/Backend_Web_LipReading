import { Injectable } from '@nestjs/common';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { TeamService } from 'src/team/team.service';
import { AuthService } from 'src/auth/auth.service';
import { VideoService } from 'src/video/video.service';

@Injectable()
export class UserWorkspaceService {
    constructor(
        private teamService : TeamService,
        private privilegeService : PrivilegeService,
        private authService : AuthService,
        private videoService : VideoService
    ){}

    async work_space(access_token : string){
        // get user_id by token
        const user_id = await this.authService.getUserByToken(access_token);

        console.log(user_id,'OK')

        // team
        // get team_id by user_id
        const teams = await this.privilegeService.findTeamByUser(user_id);
        
        console.log('teams',teams)

        // get team_info by team_id
        const teams_info = [];
        for(let i = 0; i < teams.length; i++){
            const info = await this.teamService.TeamfindById(teams[i].team_id);

            console.log(info)
            // get Only Team Online
            if(info.team_status == 'Online'){
                // // Replace image content
                // const base64String = await this.teamService.imageToBase64(info.picture_team);

                // Create modified object with desired fields
                
                const modifiedTeamInfo = {
                    'team_id': info.team_id,
                    'team_name': info.team_name,
                    // 'image_content': base64String
                    'image_path' :info.picture_team.substring(info.picture_team.lastIndexOf('/')+1)
                };

                teams_info.push(modifiedTeamInfo);
            }
        }

        // video
        // get video from user_id
        const videoes = await this.videoService.findVideoByCreateId(user_id);
        // Create modified object with desired fields
        let videoes_info = [];
        for(let i = 0; i < videoes.length; i++){

            // if (i==0){
            //     console.log(typeof videoes[i].createAt)
            //     console.log(videoes[i].createAt)
            // }
            
            const modifiedVideoInfo = {
                'video_id': videoes[i].video_id,
                'video_name': videoes[i].video_name,
                'video_date': videoes[i].createAt,
                'thumbnail' : videoes[i].thumbnail_path.substring(videoes[i].thumbnail_path.lastIndexOf('/') + 1),
            };

            videoes_info.push(modifiedVideoInfo);
        }
        // merge
        const merge_data = {
        'team' : teams_info,
        'video' : videoes_info,
        'status': '200 OK'
        }
        return merge_data;
    }
}
