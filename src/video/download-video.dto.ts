import { IsNotEmpty } from "class-validator";

export class DownloadVideoDto{

    access_token : string;
    
    @IsNotEmpty()
    video_id : number;
    
}