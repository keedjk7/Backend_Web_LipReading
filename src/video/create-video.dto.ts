import { IsNotEmpty } from "class-validator";

export class CreateVideoDto{

    access_token : string;

    // @IsNotEmpty()
    // username : string;
    
    @IsNotEmpty()
    video_name : string;

    @IsNotEmpty()
    content : string;
    
}