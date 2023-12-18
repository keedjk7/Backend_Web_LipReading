import {  IsNotEmpty } from "class-validator";

export class CreatePrivilegeDto{

    @IsNotEmpty()
    team_id:number

    @IsNotEmpty()
    user_id:number

    @IsNotEmpty()
    role:string

    post_id:number

}