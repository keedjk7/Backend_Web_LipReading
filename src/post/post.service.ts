import { ConsoleLogger, Injectable, Post } from '@nestjs/common';
import * as fs from 'fs';
import { CreatePostDto } from './create-post.dto';
import { EditPostDto } from './edit-post.dto';
import { TeamService } from 'src/team/team.service';
import { Posts } from './posts.entity';

@Injectable()
export class PostService {
    constructor(
        private teamService : TeamService
    ){}

    async fileToBase64(filePath: string) {
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

    async createPost(createPostDto:CreatePostDto){
        
        // tran base64 to file and save

        // let file_path = null;
        // if (createPostDto.file_content != null) {
        //     // get extension
        //     const extension = this.teamService.getExtension(createPostDto.file_content.charAt(0));

        //     // generate unique name
        //     let image_name = '${uuidv4()}'
        //     // file name + extension
        //     image_name = image_name + extension

        //     let Content = createPostDto.file_content;
        //     Content = Content.replace(/^data:(.*?);base64,/, ''); // <--- make it any type
        //     Content = Content.replace(/ /g, '+'); // <--- this is important

        //     const file_path = './src/post_file/${image_name}';

        //     await fs.promises.writeFile(file_path, Content, 'base64');
        // }

        console.log('pass1')

        const posts = Posts.create({
            post_description: createPostDto.post_description,
            video_id: createPostDto.video_id
        });

        const test_post = await posts.save();

        console.log('pass2')
        console.log(test_post)

        return posts;

    }

    async deletePost(post_id:number){
        await Posts.delete(post_id);
            
        return "delete post success";
    }

    // async editPost(editPostDto:EditPostDto){
    //     let change_data = await this.findPostById(editPostDto.post_id)
    //     // console.log(change_data)

    //     // text
    //     change_data.post_description = editPostDto.post_description;
    //     // // team desc
    //     // change_data.team_description = edit_team_info.team_description ;
    //     // team image
    //     // Check if there's a new file
    //     console.log(editPostDto)
    //     if (editPostDto.file_content != null) {
    //          // check extension from base64
    //          const extension = this.teamService.getExtension(editPostDto.file_content.charAt(0));

    //          // generate unique name
    //          let image_name = '${uuidv4()}'
    //          // file name + extension
    //          image_name = image_name + extension
    //          // // Save the new file
    //          let Content = editPostDto.file_content;
    //          Content = Content.replace(/^data:(.*?);base64,/, ''); // <--- make it any type
    //          Content = Content.replace(/ /g, '+'); // <--- this is important
 
    //          const file_path = './src/post_file/${image_name}';

    //         console.log('pass')
    //         // console.log(edit_team_info)
    //         // Save the file with the proper extension
    //         await fs.writeFileSync(file_path, Content, 'base64');
    //         change_data.file_path = file_path;
    //     }
    //     // non file -> delete old file if have in database
    //     else{
    //         // delete file in file path

    //         // delete file path in database
    //     }
    //     console.log(change_data)
    //     await Posts.update(editPostDto.post_id,change_data);

    //     return '200 OK'
    // }

    async findPostById(post_id: number) {
        return await Posts.findOne({
            where: {
                post_id:post_id
            }
        });
    }
    
    async findPostByVideoId(video_id:number){
        return await Posts.findOne({
            where: {
                video_id:video_id
            }
        });
    }
}
