import {  IsNotEmpty } from "class-validator";

export class CreateTeamDto{
    @IsNotEmpty()
    access_token:string;

    @IsNotEmpty()
    team_name:string;

    team_description:string;

    // picture_name : string;

    picture_team_content:string;

    member : { Email: string; Role: string }[];
}