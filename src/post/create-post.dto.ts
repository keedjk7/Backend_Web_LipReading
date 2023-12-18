import {  IsNotEmpty } from "class-validator";

export class CreatePostDto{

    @IsNotEmpty()
    team_id:number

    @IsNotEmpty()
    user_id:number

    text:string

    // file_name : string

    file_content:string

}