import { IsNotEmpty } from "class-validator";

export class CreateVideoDto{
    
    @IsNotEmpty()
    video_name : string;

    @IsNotEmpty()
    content : string;
    
}