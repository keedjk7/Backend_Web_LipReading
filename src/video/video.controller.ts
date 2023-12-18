import { Controller, Post, UseInterceptors, Body, UploadedFile, Get, Param, Res, Req } from '@nestjs/common';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateVideoDto } from './create-video.dto';
import { AuthService } from 'src/auth/auth.service';
import { DownloadVideoDto } from './download-video.dto';
import * as fs from 'fs';


@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService,private readonly authService: AuthService) {}

  // upload video
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('video'))
  // uploadFile(@UploadedFile() file){
  //   console.log(file)
  //   return this.videoService.create({
  //     video_name: (file.filename as string), video_path: (file.path as string)
  //   })
  // }
  // upload
  // @Post('upload')
  // async uploadFile(@Body() createVideoDto:CreateVideoDto){
  //   // console.log(createVideoDto)
  //   // // return this.videoService.convertFile(file.content,file.video_name)+
  //   // // const path = this.videoService.convertFile(file.content,file.video_name)
  //   // return this.videoService.create({
  //   //   video_name: file.video_name,
  //   //   // video_path: this.videoService.convertFile(file.content,file.video_name)
  //   // })
    
  //   // return this.videoService.create(createVideoDto);
  //   // return this.videoService.lipreading(createVideoDto);

  //   // process lip reading
  //   const video_obj = await this.videoService.lipreading(createVideoDto);
  //   console.log(video_obj);
  //   // check not have token (anonymous)
  //   if(createVideoDto.access_token == null){
  //     return this.videoService.create(video_obj,createVideoDto,0);
  //   }
  //   // check have token (user account)
  //   else{
  //     // get user_id
  //     const user_id = await this.authService.getUserByToken(createVideoDto.access_token);

  //     return this.videoService.create(video_obj,createVideoDto,user_id);
  //   }
    

  // }

  // upload other solution
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    // const file_path = './your/desired/file/path/' + file.originalname; // กำหนด file path ที่ต้องการบันทึกไฟล์

    // try {
    //   fs.writeFileSync(file_path, file.buffer); // บันทึกไฟล์ลงใน file path ที่กำหนด
    //   console.log('File saved successfully at:', file_path);
    //   // สามารถทำการ return หรือทำสิ่งอื่นต่อได้ตามต้องการ
    // } catch (error) {
    //   console.error('Error saving file:', error);
    //   // ในกรณีที่มีข้อผิดพลาดในการบันทึกไฟล์
    //   // สามารถทำการ handle error หรือทำสิ่งอื่นต่อได้ตามต้องการ
    // }
  }

  // download
  @Post('download')
  async downloadFile(@Body() downloadVideoDto:DownloadVideoDto){
    console.log("check",downloadVideoDto)
    
    // not have token (anonymous)
    if(downloadVideoDto.access_token == null){
      return this.videoService.download(downloadVideoDto.video_id,0)
    }
    // have token (user_account)
    else{
      const user_id = await this.authService.getUserByToken(downloadVideoDto.access_token);
      console.log('user_id',user_id);
      return this.videoService.download(downloadVideoDto.video_id,user_id)
    }
  }
    

  // // history
  // @Get('history')
  // historyVideo(@Body() historyReq){
  //   return this.videoService.getHistory(historyReq.username)
  // }

  // @Get('test')
  // test(){

  //   // return this.videoService.lipreading();
  // }


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


  // @Get('download/:videoname')
  // seeUploadedFile(@Param('videoname') video,
  // @Res() res){
  //   return res.sendFile(video, {root: '../upload'});
  // }
}
 