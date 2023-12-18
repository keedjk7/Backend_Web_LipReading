import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePrivilegeDto } from './create-privilege.dto';
import { Privilege } from './privilege.entity';
import { Managment_team } from './managment-team.dto';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import {Not } from 'typeorm';

@Injectable()
export class PrivilegeService {
    constructor(
        // private authService : AuthService,
        @Inject(forwardRef(() => AuthService)) private authService : AuthService,
        private userService : UsersService
    ){}
    // add member to team
    async add_privilege(createPrivilegeDto:CreatePrivilegeDto){
        console.log(createPrivilegeDto);

        const {team_id,  user_id, role, post_id} = createPrivilegeDto;
        // create
        const privilege = Privilege.create({team_id: createPrivilegeDto.team_id,
            user_id: createPrivilegeDto.user_id,
            role: createPrivilegeDto.role,
            post_id: createPrivilegeDto.post_id,
        });

        // save
        await privilege.save();

        console.log('save success')

        return '200 OK' ;
    }

    // show all member and each role in team
    async show_team_privilege(team_id){
        const team_privilege = this.findMemberInTeam(team_id);
        console.log(team_privilege);
        return team_privilege;
    }

    // change role
    async change_role(managment_team:Managment_team){

        // find changer_id by access_token
        const changer_id = await this.authService.getUserByToken(managment_team.access_token);

        // find changed_id by username
        const changed = await this.userService.findByUsername(managment_team.changed_username);
        const changed_id = changed.id;

        // check changer and changed role if changer higher than changed
        const changer_privilege = await this.findPrivilegeByUserAndTeam(changer_id,managment_team.team_id);

        const changed_privilege = await this.findPrivilegeByUserAndTeam(changed_id,managment_team.team_id);

        // console.log(changer);

        // console.log(changed);

        // check role can permission
        const permission = await this.privilege_permission(changer_privilege.role,changed_privilege.role,'change_role')
        // don't have permission
        if (permission == false){
            return "403 Forbidden";
        }
        // change role
        else{
            console.log('update');
            // set role
            changed_privilege.role = managment_team.change_role;
            
            await Privilege.update(changed_privilege.privilege_id,changed_privilege);

            return '200 OK';
        }
        
    }

    // kick account from team (delete on team id)
    async kick_member_team(managment_team:Managment_team){

        console.log(managment_team);
        // const{changer_id,changed_id,team_id} = managment_team;

        // find changer_id by access_token
        const changer_id = await this.authService.getUserByToken(managment_team.access_token);

        // find changed_id by username
        const changed = await this.userService.findByUsername(managment_team.changed_username);
        const changed_id = changed.id;


        const changer_privilege = await this.findPrivilegeByUserAndTeam(changer_id,managment_team.team_id);

        const changed_privilege = await this.findPrivilegeByUserAndTeam(changed_id,managment_team.team_id);

        // check role can permission
        const permission = await this.privilege_permission(changer_privilege.role,changed_privilege.role,'kick')
        // don't have permission
        if (permission == false){
            return "403 Forbidden";
        }
        // kick this account
        else{
            console.log('kick');

            // find data privilege user in team to delete
            const user_to_delete = await Privilege.find({
                where: {
                    team_id: managment_team.team_id,
                    user_id: changed_id,
                }
            });
            console.log(user_to_delete);

            // seperate data id
            const delete_id = user_to_delete.map(value => value.privilege_id);
            console.log(delete_id);
            // delete all data by privilege_id
            for (let i = 0; i < delete_id.length; i++){
                console.log('delete',delete_id[i])
                await Privilege.delete(delete_id[i]);
             }

            // await Privilege.delete(data_to_delete.privilege_id);

            return '200 OK';
        }

    }

    // block permission
    async block_permission(managment_team:Managment_team){

        console.log(managment_team);
        // const{changer_id,changed_id} = managment_team;

        // find changer_id by access_token
        const changer_id = await this.authService.getUserByToken(managment_team.access_token);

        // find changed_id by username
        let changed_id = null;
        // case check permission in only not have changed user
        if (managment_team.changed_username != null){
            const changed = await this.userService.findByUsername(managment_team.changed_username);
            changed_id = changed.id;
        }
        

        let permission = false;

        // 0 mean web_admin
        if (changer_id == 0){
            permission = true
        }

        return  {
            "permission" : permission,
            "changed_id" : changed_id};

    }

    // unblock user account

    // privilege permission
    async privilege_permission(changer_role,changed_role,event){
        console.log(changer_role,changed_role,event);
        let permission = false;
        // role that can edit
        // web_admin can edit all
        if (changer_role == 'web_admin'){
            permission = true;
        }
        // change_role and kick user
        else if (event == 'change_role'|| event == 'kick'){
            // team_owner can edit team_admin and member
            if (changer_role == 'Owner' && (changed_role == 'Admin'||changed_role == 'User')){
                permission = true;
            }
            // team_admin can edit member
            else if (changer_role == 'Admin' && changed_role == 'User'){
                permission = true;
            }
            else{
                console.log('Fail to Change Role');
            }
        }
        // team_owner can edit team and delete team
        else if((event == 'edit_team' || event == 'delete_team')&& changer_role == 'Owner'){
            permission = true;
        }
        // Post_Owner can edit post
        else if(event == 'edit_post' && changer_role == 'Post_Owner'){
            permission = true;
        }
        // Post_Owner, team_owner, Admin can delete post
        else if(event == 'delete_post' &&(changer_role == 'Owner' || changer_role == 'Admin' || changer_role == 'Post_Owner')){
            permission = true;
        }
        
        console.log(permission);

        return permission;
    }

    // count member in team
    async countMemberTeam(team_id: number) {
        console.log(team_id);
        const team = await Privilege.find({
            where: {
                team_id:team_id,
                post_id: 0,
            }
        });

        return {
            "team_id":team_id,
            "count_member":team.length
        }
    }


    // find team by user
    async findTeamByUser(user_id: number) {
        console.log(user_id);
        return await Privilege.find({
            where: {
                user_id:user_id,
                post_id: 0,
            }
        });
    }

    // Find privilege by user and team
    async findPrivilegeByUserAndTeam(user_id: number, team_id: number) {
        return await Privilege.findOne({
        where: {
            user_id: user_id,
            team_id: team_id,
            post_id: 0, // Assuming post_id is also a criterion
        },
        });
    }

    // find by userId & team
    async findMemberInTeam(team_id: number) {
        return await Privilege.find({
            where: {
                team_id:team_id,
                post_id: 0,
            }
        });
    }

    async findPostByTeamId(team_id: number){
        return await Privilege.find({
            where:{
                team_id:team_id,
                post_id: Not(0)
            }
        })
    }
    


    // // find by userId & team
    // async findRoleMemberInTeam(user_id: number, team_id: number) {
    //     return await Privilege.findOne({
    //         where: {
    //             team_id:team_id,
    //             user_id:user_id,
    //             post_id: 0
    //         }
    //     });
    // }
    // delete team privilege
    async delete_team(team_id: number){
        // find all pri in this team
        const team_privilege = await Privilege.find({
            where: {
                team_id:team_id,
            }
        });
        // seperate data id
        const delete_ids = team_privilege.map(value => value.privilege_id);
        console.log(delete_ids);
        // delete all data by id
        for (let i = 0; i < delete_ids.length; i++){
            console.log('delete',delete_ids[i])
            await Privilege.delete(delete_ids[i]);
         }
    }

    async delete_post(post_id: number){
        await Privilege.delete(post_id)
    }

}
