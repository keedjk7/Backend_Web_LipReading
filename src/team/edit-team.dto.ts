import {  IsNotEmpty, isNotEmpty } from "class-validator";

export class EditTeamDto{
    @IsNotEmpty()
    access_token:string;

    @IsNotEmpty()
    team_id: number;

    team_name:string;

    team_description:string;

    picture_team_content:string;
}