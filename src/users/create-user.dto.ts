import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class CreateUserDto{
    @IsEmail()
    email : string;
i
    @IsNotEmpty()
    password : string;

    username : string;

    surname : string;

    lastname : string;

    // @Matches(/\d{4}-\d{2}-\d{2}/, { message: 'Invalid date format. Use YYYY-MM-DD' })
    birthday : string;
}