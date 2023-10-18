import { Controller, Post, UseInterceptors, Body, UploadedFile, Get, Param, Res, Req } from '@nestjs/common';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateVideoDto } from './create-video.dto';


@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  // upload video
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('video'))
  // uploadFile(@UploadedFile() file){
  //   console.log(file)
  //   return this.videoService.create({
  //     video_name: (file.filename as string), video_path: (file.path as string)
  //   })
  // }
  
  @Post('upload')
  uploadFile(@Body() createVideoDto:CreateVideoDto){
    console.log(createVideoDto)
    // // return this.videoService.convertFile(file.content,file.video_name)+
    // // const path = this.videoService.convertFile(file.content,file.video_name)
    // return this.videoService.create({
    //   video_name: file.video_name,
    //   // video_path: this.videoService.convertFile(file.content,file.video_name)
    // })
    
    // return this.videoService.create(createVideoDto);
    return this.videoService.lipreading(createVideoDto);

  }

  // download
  @Post('download')
  downloadFile(@Body() reqFile){
    console.log("check",reqFile)
    return this.videoService.download(reqFile.video_name)

    // return this.videoService.donwload()
  }

  @Get('test')
  test(){

    // return this.videoService.lipreading();
  }


  // @Get('getVideo')
  // getVideo(@Req() req, @Res() res){
  //   console.log('Get',req,res)
  //   this.videoService.getVideoStream(req,res);
  // }


  // @Post('getVideo')
  // postVideo(@Req() req, @Res() res){
  //   console.log('Post',req,res)
  //   this.videoService.uploadVideoStream(req,res)
  //   // console.log('Post',req,res)
  // }

    

  

  // create(@Body() createUserDto: CreateUserDto){
  //   return this.usersService.create(createUserDto);
  // }


  @Get('download/:videoname')
  seeUploadedFile(@Param('videoname') video,
  @Res() res){
    return res.sendFile(video, {root: '../upload'});
  }
}
 