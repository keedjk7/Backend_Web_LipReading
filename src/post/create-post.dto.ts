import {  IsNotEmpty } from "class-validator";

export class CreatePostDto{
    
    // @IsNotEmpty()
    // user_id:number
    @IsNotEmpty()
    access_token:string

    @IsNotEmpty()
    team_id:number

    @IsNotEmpty()
    video_id:number

    post_description:string

    // file_name : string
    // file_content:string
}