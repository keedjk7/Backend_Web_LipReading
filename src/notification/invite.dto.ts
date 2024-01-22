import {  IsNotEmpty } from "class-validator";

export class InviteDto{

    access_token:string

    email:string

    team_id:number

    role:string
}