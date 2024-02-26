import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './create-team.dto';
import { Team } from './team.entity';
import * as fs from 'fs';
import { EditTeamDto } from './edit-team.dto';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from 'src/notification/notification.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { InviteDto } from '../notification/invite.dto';

@Injectable()
export class TeamService {

//     // create team only for image
//     async create_team(createTeamDto: CreateTeamDto){
//         try {
//             console.log('Received createTeamDto:', createTeamDto);

//             // // add file extension (jpg)
//             // createTeamDto.team_name = createTeamDto.team_name + '.jpg'
    
//             if (createTeamDto.picture_team_content != null) {
//                 // // add with team_name in picture_name
//                 // createTeamDto.picture_name = createTeamDto.team_name + '_' + createTeamDto.picture_name ;

//                 // check extension from base64
//                 const extension = await this.getExtension(createTeamDto.picture_team_content.charAt(0));
//                 console.log('ex',extension)
//                 // generate unique name
//                 let image_name = `${uuidv4()}`;

//                 // file name + extension
//                 image_name = image_name + extension;
//                 console.log(image_name)

//                 let Content = createTeamDto.picture_team_content;
//                 Content = Content.replace(/^data:(.*?);base64,/, ''); // <--- make it any type
//                 Content = Content.replace(/ /g, '+'); // <--- this is important

//                 const picture_path = `./src/picture_team/${image_name}`; // Use backticks here

//                 console.log("---------show---------")
//                 console.log(picture_path)

//                 await fs.promises.writeFile(picture_path, Content, 'base64');

//                 const team = Team.create({
//                     team_name: createTeamDto.team_name,
//                     team_description: createTeamDto.team_description,
//                     picture_team: picture_path,
//                     team_status: 'Online',
//                 });

// // Rest of your code remains unchanged...

    
//                 const saveTeam = await team.save();
    
//                 console.log('create team success');
//                 console.log('saveTeam:', saveTeam);
    
//                 const createdTeam = await Team.findOne({ where: { team_id: saveTeam.team_id } });
    
//                 if (createdTeam) {
//                     console.log('Created Team:', createdTeam);
//                     return createdTeam.team_id;
//                 } else {
//                     throw new Error('Failed to retrieve created team');
//                 }
//             } 
//             else {
//                 throw new Error('No picture_team_content provided');
//             }
//         } catch (error) {
//             console.error('Error occurred during team creation:', error);
//             throw error;
//         }
//     }

    async create_team_basic(createTeamDto:CreateTeamDto,imagePath:string){
        const team = Team.create({
            team_name: createTeamDto.team_name,
            team_description: createTeamDto.team_description,
            picture_team: imagePath,
            team_status: 'Online',
        });

        const saveTeam = await team.save();
    
        console.log('create team success');
        console.log('saveTeam:', saveTeam);

        
        const createdTeam = await Team.findOne({ where: { team_id: saveTeam.team_id } });
    
        if (createdTeam) {
            console.log('Created Team:', createdTeam);
            return createdTeam.team_id;
        } else {
            throw new Error('Failed to retrieve created team');
        }
    }

    // old
    // async edit_save(edit_team_info:EditTeamDto){
    //     let change_data = await this.TeamfindById(edit_team_info.team_id)
    //     // console.log(change_data)

    //     // team name
    //     if (edit_team_info.team_name != ''){
    //         change_data.team_name = edit_team_info.team_name;
    //     }
        
    //     // team desc
    //     if (edit_team_info.team_description!= ''){
    //         change_data.team_description = edit_team_info.team_description ;
    //     }
    //     // team image
    //     // Check if there's a new image
    //     console.log(edit_team_info)
    //     if ( edit_team_info.picture_team_content != '') {
    //          // check extension from base64
    //          const extension = await this.getExtension(edit_team_info.picture_team_content.charAt(0));
    //          console.log('ex',extension)
    //          // generate unique name
    //          let image_name = `${uuidv4()}`;

    //          // file name + extension
    //          image_name = image_name + extension;
    //          console.log(image_name)
    //          // // Save the new image
    //          let Content = edit_team_info.picture_team_content;
    //          Content = Content.replace(/^data:(.*?);base64,/, ''); // <--- make it any type
    //          Content = Content.replace(/ /g, '+'); // <--- this is important

    //          const picture_path = `./src/picture_team/${image_name}`; // Use backticks here

    //         console.log('---------------edit&save-------------------')
    //         // console.log(edit_team_info)
    //         // Save the file with the proper extension
    //         await fs.writeFileSync(picture_path, Content, 'base64');
    //         change_data.picture_team = picture_path;
    //     }
    //     console.log('edit',change_data)
    //     await Team.update(edit_team_info.team_id,change_data);

    //     return '200 OK'

    // }


    // new
    async edit_save(edit_team_info:EditTeamDto,image_path:string){
        let change_data = await this.TeamfindById(edit_team_info.team_id)
        console.log('edit_save',edit_team_info,image_path)

        // team name
        if (edit_team_info.team_name != undefined){
            change_data.team_name = edit_team_info.team_name;
        }
        
        // team desc
        if (edit_team_info.team_description!= undefined){
            change_data.team_description = edit_team_info.team_description ;
        }
        // team image 
        if (image_path!= undefined){
            change_data.picture_team = image_path ;
        }

        
        console.log('edit team',change_data)
        await Team.update(edit_team_info.team_id,change_data);

        return '200 OK'

    }

    
    // async imageToBase64(filePath: string) {
    //     try {
    //       const imageBuffer = fs.readFileSync(filePath);
    //       const base64String = imageBuffer.toString('base64');
    //       const newbase64String = 'data:image/png;base64,' + base64String;
    //       return newbase64String;
    //     } catch (error) {
    //       // Handle errors, such as file not found or permissions issues
    //       throw new Error('Error converting image to base64: ' + error.message);
    //     }
    // }

    async getExtension(firstChar:string){
        let extension = null;
             if (firstChar=='/'){
                extension = '.jpg'
             }
             else if(firstChar =='i'){
                extension = '.png'
             }
             else if(firstChar =='J'){
                extension = '.pdf'
            }
             else if(firstChar =='U'){
                extension = '.webp'
             }
             else{
                console.log('other extension')
             }

             console.log(extension)
             return extension
    }
    
    async delete_team(team_id:number){
        // delete in team database
        await Team.delete(team_id);
        
        return "delete team success";
    }

    // 

    // Offline team
     async Offline_team(change_team_id){
        try{
            const Offline_team = await this.TeamfindById(change_team_id);
            if (Offline_team.team_status == 'Online'){
                Offline_team.team_status = 'Offline';
                await Team.update( Offline_team.team_id,Offline_team);
    
                return 'Offline team success';
            }
            else{
                return 'this team has already Offline'
            }
           
        }
        catch (error){
            // return 'not found this account';
            throw error;
         }
    }

    // Online team
    async Online_team(change_team_id){

        try{
            const Online_team = await this.TeamfindById(change_team_id);
            if (Online_team.team_status == 'Offline'){
                Online_team.team_status = 'Online';
                await Team.update( Online_team.team_id,Online_team);

                return 'Online team success';
            }
            else{
                return 'this team has already Online'
            }
        
        }
        catch (error){
            // return 'not found this account';
            throw error;
        }
    }

    async TeamfindById(team_id: number) {
        return await Team.findOne({
            where: {
                team_id:team_id
            }
        });
    }

    async getAllTeam(){
        return await Team.find();
    }
}
