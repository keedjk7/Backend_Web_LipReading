import {  IsNotEmpty } from "class-validator";

export class EditPostDto{

    @IsNotEmpty()
    access_token:string

    @IsNotEmpty()
    post_id:number

    @IsNotEmpty()
    team_id:number

    post_description:string

    // file_name : string

    file_content:string

}