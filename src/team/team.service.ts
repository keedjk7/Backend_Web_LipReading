import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './create-team.dto';
import { Team } from './team.entity';
import * as fs from 'fs';
import { EditTeamDto } from './edit-team.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TeamService {

    // create team only
    async create_team(createTeamDto: CreateTeamDto){
        try {
            console.log('Received createTeamDto:', createTeamDto);

            // // add file extension (jpg)
            // createTeamDto.team_name = createTeamDto.team_name + '.jpg'
    
            if (createTeamDto.picture_team_content != null) {
                // // add with team_name in picture_name
                // createTeamDto.picture_name = createTeamDto.team_name + '_' + createTeamDto.picture_name ;

                // check extension from base64
                const extension = this.getExtension(createTeamDto.picture_team_content.charAt(0));

                // generate unique name
                let image_name = `${uuidv4()}`;

                // file name + extension
                image_name = image_name + extension;

                let Content = createTeamDto.picture_team_content;
                Content = Content.replace(/^data:(.*?);base64,/, ''); // <--- make it any type
                Content = Content.replace(/ /g, '+'); // <--- this is important

                const picture_path = `./src/picture_team/${image_name}`; // Use backticks here

                console.log("---------show---------")
                console.log(image_name,picture_path,extension)

                await fs.promises.writeFile(picture_path, Content, 'base64');

                const team = Team.create({
                    team_name: createTeamDto.team_name,
                    team_description: createTeamDto.team_description,
                    picture_team: picture_path,
                    team_status: 'active',
                });

// Rest of your code remains unchanged...

    
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
            else {
                throw new Error('No picture_team_content provided');
            }
        } catch (error) {
            console.error('Error occurred during team creation:', error);
            throw error;
        }
    }

    async edit_save(edit_team_info:EditTeamDto){
        let change_data = await this.TeamfindById(edit_team_info.team_id)
        // console.log(change_data)

        // team name
        change_data.team_name = edit_team_info.team_name;
        // team desc
        if (typeof edit_team_info.team_description != "undefined"){
            change_data.team_description = edit_team_info.team_description ;
        }
        // team image
        // Check if there's a new image
        console.log(edit_team_info)
        if (typeof edit_team_info.picture_team_content != "undefined") {
             // check extension from base64
             const extension = this.getExtension(edit_team_info.picture_team_content.charAt(0));

             // generate unique name
             let image_name = '${uuidv4()}'
             // file name + extension
             image_name = image_name + extension
             // // Save the new image
             let Content = edit_team_info.picture_team_content;
             Content = Content.replace(/^data:(.*?);base64,/, ''); // <--- make it any type
             Content = Content.replace(/ /g, '+'); // <--- this is important
 
             const picture_path = './src/picture_team/${image_name}';

            console.log('pass')
            // console.log(edit_team_info)
            // Save the file with the proper extension
            await fs.writeFileSync(picture_path, Content, 'base64');
            change_data.picture_team = picture_path;
        }
        console.log(change_data)
        await Team.update(edit_team_info.team_id,change_data);

        return '200 OK'

    }

    
    async imageToBase64(filePath: string) {
        try {
          const imageBuffer = fs.readFileSync(filePath);
          const base64String = imageBuffer.toString('base64');
          const newbase64String = 'data:image/png;base64,' + base64String;
          return newbase64String;
        } catch (error) {
          // Handle errors, such as file not found or permissions issues
          throw new Error('Error converting image to base64: ' + error.message);
        }
    }

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
             return extension
    }
    
    async delete_team(team_id:number){
        // delete in team database
        await Team.delete(team_id);
        
        return "delete team success";
    }

    // 

    // block team
     async block_team(change_team_id){
        try{
            const block_team = await this.TeamfindById(change_team_id);
            if (block_team.team_status == 'active'){
                block_team.team_status = 'block';
                await Team.update( block_team.team_id,block_team);
    
                return 'block team success';
            }
            else{
                return 'this team has already block'
            }
           
        }
        catch (error){
            // return 'not found this account';
            throw error;
         }
    }

    // active team
    async active_team(change_team_id){

        try{
            const active_team = await this.TeamfindById(change_team_id);
            if (active_team.team_status == 'block'){
                active_team.team_status = 'active';
                await Team.update( active_team.team_id,active_team);

                return 'active team success';
            }
            else{
                return 'this team has already active'
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


}
