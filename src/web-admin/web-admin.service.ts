import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { TeamService } from 'src/team/team.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WebAdminService {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private teamService: TeamService,
        private privilegeService: PrivilegeService,
    ) { }

    // User
    async checkWebAdmin(access_token:string){
        const user = await this.authService.checkToken_get_user(access_token)

        console.log(user)
        // check prilvilege role
        if(user.id == 0){
            return "WebAdmin"
        }
    }

    async getAllUserInfo(access_token:string){

        if(await this.checkWebAdmin(access_token)!= "WebAdmin"){
            return '403 : Forbidden'
        }

        const allUser = await this.usersService.getAllUser()

        let returnAllUser = []

        for(let i=0;i<allUser.length;i++){
            // in teams count number
            const teams = await this.privilegeService.findTeamByUser(allUser[i].id)
            
            const editUser = {
                user_id : allUser[i].id,
                username : allUser[i].username,
                email : allUser[i].email,
                // in teams count number
                teams : teams.length,
                date : allUser[i].createAt,
                status : allUser[i].account_status
            }
            returnAllUser.push(editUser)
        }

        return {
            UserInfo : returnAllUser,
            status: '200 OK'
        }
    }

    async editStatusUser(body:any){
        try{
            if(await this.checkWebAdmin(body.access_token)!= "WebAdmin"){
                return '403 : Forbidden'
            }

            // set user to Online 
            if(body.status == 'Online'){
                await this.usersService.Online_user(body.changed_user_id)
            }
            // set user to Offline
            else if(body.status == 'Offline'){
                await this.usersService.Offline_user(body.changed_user_id)
            }
            return{
                status: '200 OK'
            }
        }
        catch(error) {
            throw error;
        }

    }


    // Team
    async getAllTeamInfo(access_token:string){

        if(await this.checkWebAdmin(access_token)!= "WebAdmin"){
            return '403 : Forbidden'
        }

        const allTeam = await this.teamService.getAllTeam()

        let returnAllTeam = []

        for(let i=0;i<allTeam.length;i++){
            // get owner team
            const owner = await this.privilegeService.findOwnerInTeam(allTeam[i].team_id)
            
            console.log(owner,allTeam[i].team_id)

            const owner_email = (await this.usersService.findById(owner.user_id)).email
            
            const editTeam = {
                team_id : allTeam[i].team_id,
                team_name : allTeam[i].team_name,
                owner : owner_email,
                member : await this.privilegeService.countMemberTeam(allTeam[i].team_id),
                date : allTeam[i].createAt,
                status : allTeam[i].team_status
            }
            returnAllTeam.push(editTeam)
        }

        return  {
            teamInfo : returnAllTeam,
            status : '200 OK'
        }
    }
    async editStatusTeam(body:any){
        try{
            if(await this.checkWebAdmin(body.access_token)!= "WebAdmin"){
                return '403 : Forbidden'
            }

            // set team to Online
            if(body.status == 'Online'){
                await this.teamService.Online_team(body.changed_team_id)
            }
            // set team to Offline
            else if(body.status == 'Offline'){
                await this.teamService.Offline_team(body.changed_team_id)
            }

            return{
                status:'200 OK'
            }
        }
        catch(error) {
            throw error;
        }

    }
}
