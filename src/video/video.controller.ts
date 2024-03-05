import { Controller, Post, UseInterceptors, Body, UploadedFile, Get, Param, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateVideoDto } from './create-video.dto';
import { AuthService } from 'src/auth/auth.service';
import { DownloadVideoDto } from './download-video.dto';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import * as FormData from 'form-data';
import * as fs from 'fs';
import axios from 'axios';
import { Video } from './video.entity';
import { UsersService } from 'src/users/users.service';


@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService, private readonly authService: AuthService
    ,private readonly usersService: UsersService) { }

  // upload video
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('video'))
  // uploadFile(@UploadedFile() file){
  //   console.log(file)
  //   return this.videoService.create({
  //     video_name: (file.filename as string), video_path: (file.path as string)
  //   })
  // }

  // old upload
  // @Post('upload')
  // async uploadFile(@Body() createVideoDto:CreateVideoDto){
  //   console.log(createVideoDto)
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

  // new upload
  @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.env.origin_video,
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        // return cb(null, `${randomName}${extname(file.originalname)}`);
        const originalName = basename(file.originalname, extname(file.originalname));
        const filename = `${originalName}_${randomName}${extname(file.originalname)}`;
        return cb(null, filename);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() createVideoDto: CreateVideoDto) {
    console.log('upload')
    console.log(createVideoDto.access_token)
    console.log(file)

    if (!file || !file.path || !file.originalname) {
      // Handle the case where file properties are missing
      throw new Error('Invalid file data');
    }


    // form data
    const formData = new FormData();
    const fileStream = fs.createReadStream(file.path);

    formData.append('file', fileStream, { filename: file.filename });

    console.log(process.env.new_lip_reading,'\n',formData)

    // save new video without process
    

    // process lip reading
    const response = await axios.post(process.env.new_lip_reading, formData, {
      headers: formData.getHeaders(),
      maxRedirects: 0,
    });
    // console.log(response.status);
    // console.log(response.headers);
    console.log(response.data);

    // return '200 OK';

    const video_obj = await response.data

    console.log('obj',video_obj)

    // update after finish process
    if (createVideoDto.access_token === undefined) {
      console.log('undefined');
      return this.videoService.create(video_obj, 0);
    }
    // check have token (user account)
    else {
      console.log('user');
      // get user_id
      const user_id = await this.authService.getUserByToken(createVideoDto.access_token);

      return this.videoService.create(video_obj, user_id);
    }
  }

  @Post('test')
  async test(){
    const response = await axios.post('http://161.246.5.151:7779/test');
  }


  // // download subtitle
  // @Post('download_subtitle')
  // async download_subtitle(@Body() downloadVideoDto: DownloadVideoDto) {
  //   console.log("check", downloadVideoDto)
  //   console.log('donwload case user')
  //   const user_id = await this.authService.getUserByToken(downloadVideoDto.access_token);
  //   return this.videoService.download_subtitle(downloadVideoDto.video_id, user_id)

  //   // have token (user_account)
  // }

  // @Post('download_video')
  // async download_video(@Body() downloadVideoDto: DownloadVideoDto) {
  //   console.log("check", downloadVideoDto)
  //   console.log('donwload case user')
  //   const user_id = await this.authService.getUserByToken(downloadVideoDto.access_token);
  //   return this.videoService.download_video(downloadVideoDto.video_id, user_id)

  //   // have token (user_account)
  // }


  @Post('new_download_subtitle')
  async new_download_subtitle(@Body() downloadVideoDto: DownloadVideoDto) {
    console.log("check", downloadVideoDto)
    console.log('donwload case user')
    const user_id = await this.authService.getUserByToken(downloadVideoDto.access_token);
    return this.videoService.new_download_subtitle(downloadVideoDto.video_id, user_id)

    // have token (user_account)
  }

  // ใช้จริง
  @Post('new_download_video')
  async new_download_video(@Body() downloadVideoDto: DownloadVideoDto) {
    console.log("new_download_video", downloadVideoDto)

    // not have token (anonymous)
    if (downloadVideoDto.access_token === undefined) {
      console.log('donwload case anonymous')
      return this.videoService.new_download_video(downloadVideoDto.video_id, 0)
    }
    
    // have token (user_account)
    else {
      console.log('donwload case user')
      const user_id = await this.authService.getUserByToken(downloadVideoDto.access_token);
      console.log('user_id', user_id);
      const response =  await this.videoService.new_download_video(downloadVideoDto.video_id, user_id)
      console.log(response)
      return response
    }

    // console.log('donwload case user')
    // const user_id = await this.authService.getUserByToken(downloadVideoDto.access_token);
    // return this.videoService.new_download_video(downloadVideoDto.video_id, user_id)

    // // have token (user_account)
  }


  // getAllvideoUser
  @Post('getVideoesUser')
  async getViddeo(@Body() token) {
    const user_id = (await this.authService.checkToken_get_user(token.access_token)).id
    const user_info = await this.usersService.findById(user_id)
    const video = await this.videoService.findVideoByCreateId(user_id);
    console.log(user_id, video)
    return {
      video: video,
      username: user_info.username,
      user_profile: user_info.profile_image.substring(user_info.profile_image.lastIndexOf('/')+1),
      status: '200 OK'
    }
  }

  // delete video
  @Post('deleteVideo')
  async deleteVideo(@Body() body){
    const user_id = (await this.authService.checkToken_get_user(body.access_token)).id
    return await this.videoService.deleteVideo(body.video_id,user_id)
  }
}
