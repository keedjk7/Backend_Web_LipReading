import {  IsNotEmpty } from "class-validator";

export class CreateNotification{

    sender_id:number

    receiver_id:number

    team_id:number

    role: string
}