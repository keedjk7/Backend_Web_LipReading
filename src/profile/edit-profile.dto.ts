import {  IsNotEmpty } from "class-validator";

export class EditProfileDto{
    @IsNotEmpty()
    access_token:string;

    username:string;

    email:string;

    birthday :Date;

}