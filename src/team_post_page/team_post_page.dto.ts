import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class TeamPostPageDto{
   team_id:number

   post_id:number

   access_token:string

}