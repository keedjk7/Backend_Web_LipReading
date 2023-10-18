import { IsEmail, IsNotEmpty} from "class-validator";

export class AuthLoginDto{
    @IsEmail()
    email : string;

    username : string;

    @IsNotEmpty()
    password : string;
}