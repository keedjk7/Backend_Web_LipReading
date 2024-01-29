import { Controller, Post, UseInterceptors, Body, UploadedFile, Get, Param, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateVideoDto } from './create-video.dto';
import { AuthService } from 'src/auth/auth.service';
import { DownloadVideoDto } from './download-video.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as FormData from 'form-data';
import * as fs from 'fs';
import axios from 'axios';
import { Video } from './video.entity';


@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService, private readonly authService: AuthService) { }

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
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() createVideoDto: CreateVideoDto) {
    console.log(createVideoDto.access_token)
    console.log(file)

    if (!file || !file.path || !file.originalname) {
      // Handle the case where file properties are missing
      throw new Error('Invalid file data');
    }


    // form data
    const formData = new FormData();
    const fileStream = fs.createReadStream(file.path);

    formData.append('file', fileStream, { filename: file.originalname });

    console.log(process.env.new_lip_reading,'\n',formData)
    // process lip reading

    const response = await axios.post(process.env.new_lip_reading, formData, {
      headers: formData.getHeaders(),
      maxRedirects: 0,
    });
    console.log(response.status);
    console.log(response.headers);
    // console.log(response.data);

    // return '200 OK';

    const video_obj = response.data

    if (createVideoDto.access_token === undefined) {
      console.log('undefined');
      return this.videoService.create(video_obj, createVideoDto, 0);
    }
    // check have token (user account)
    else {
      console.log('user');
      // get user_id
      const user_id = await this.authService.getUserByToken(createVideoDto.access_token);

      return this.videoService.create(video_obj, createVideoDto, user_id);
    }
  }

  // // upload other solution form-data
  // @Post('test')
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './src/test',
  //     filename: (req, file, cb) => {
  //       const randomName = Array(32)
  //         .fill(null)
  //         .map(() => Math.round(Math.random() * 16).toString(16))
  //         .join('');
  //       return cb(null, `${randomName}${extname(file.originalname)}`);
  //     },
  //   }),
  // }))
  // async test(@Body() textData, @UploadedFile() file: Express.Multer.File) {
  //   console.log('Access Token:', textData.access_token);
  //   console.log('Access Token:', textData.list);
  //   console.log('Uploaded file:', file);
  //   return { message: 'Data received successfully', textData, filename: file.filename };
  // }

  @Post('test')
  async test(){
    const response = await axios.post('http://161.246.5.151:7779/test');
  }
  

  // // old download
  // @Post('download')
  // async downloadFile(@Body() downloadVideoDto:DownloadVideoDto){
  //   console.log("check",downloadVideoDto)

  //   // not have token (anonymous)
  //   if(typeof downloadVideoDto.access_token == 'undefined'){
  //     console.log('donwload case anonymous')
  //     return this.videoService.download(downloadVideoDto.video_id,0)
  //   }
  //   // have token (user_account)
  //   else{
  //     console.log('donwload case user')
  //     const user_id = await this.authService.getUserByToken(downloadVideoDto.access_token);
  //     console.log('user_id',user_id);
  //     return this.videoService.download(downloadVideoDto.video_id,user_id)
  //   }
  // }

  // download subtitle
  @Post('download_subtitle')
  async download_subtitle(@Body() downloadVideoDto: DownloadVideoDto) {
    console.log("check", downloadVideoDto)
    console.log('donwload case user')
    const user_id = await this.authService.getUserByToken(downloadVideoDto.access_token);
    return this.videoService.download_subtitle(downloadVideoDto.video_id, user_id)

    // have token (user_account)
  }

  @Post('download_video')
  async download_video(@Body() downloadVideoDto: DownloadVideoDto) {
    console.log("check", downloadVideoDto)
    console.log('donwload case user')
    const user_id = await this.authService.getUserByToken(downloadVideoDto.access_token);
    return this.videoService.download_video(downloadVideoDto.video_id, user_id)

    // have token (user_account)
  }

  // // new download
  // @Post('new_download')
  // async downloadFile(@Body() downloadVideoDto: DownloadVideoDto, @Res() res: Response) {
  //   try {
  //     console.log("new", downloadVideoDto)

  //     // not have token (anonymous)
  //     if (downloadVideoDto.access_token === undefined) {
  //       console.log('donwload case anonymous')
  //       return this.videoService.new_download(downloadVideoDto.video_id, 0)
  //     }
  //     // have token (user_account)
  //     else {
  //       console.log('donwload case user')
  //       const user_id = await this.authService.getUserByToken(downloadVideoDto.access_token);
  //       console.log('user_id', user_id);
  //       const response = await this.videoService.new_download(downloadVideoDto.video_id, user_id)

  //       console.log(response)
  //       // set Path for each file
  //       let temp_path = response.merge_path
  //       temp_path = temp_path.replace(/^\./, ''); // ตัด . ด้านหน้าสุดออก
  //       const ProductFilePath = process.env.path_ml + temp_path
  //       temp_path = response.sub_path
  //       temp_path = temp_path.replace(/^\./, ''); // ตัด . ด้านหน้าสุดออก
  //       const SubtitleFilePath = process.env.path_ml + temp_path

  //       console.log('ProductFilePath:', ProductFilePath);
  //       console.log('SubtitleFilePath:', SubtitleFilePath);

  //       const video = await Video.findOne({ where: { video_id: downloadVideoDto.video_id } })
  //       // get name of each file from databse

  //       const ProductFileName = 'embeded_' + video.video_name
  //       const SubtitleFileName = 'subtitle_' + video.video_name

  //       // res.json({ text: 'hello' });

  //       res.setHeader('Content-Type', 'application/zip');
  //       res.setHeader('Content-Disposition', 'attachment; filename=lip_reading.zip');
  //       // fileStream.pipe(res);
  //       const archive = archiver('zip', {
  //         zlib: { level: 9 } // Set compression level
  //       });

  //       // Pipe the zip file to the response
  //       archive.pipe(res);

  //       // Append file 1
  //       archive.append(fs.createReadStream(ProductFilePath), { name: ProductFileName });

  //       // Append file 2
  //       archive.append(fs.createReadStream(SubtitleFilePath), { name: SubtitleFileName });

  //       // Finalize the archive and send the response
  //       archive.finalize();
  //     }
  //   } catch (error) {
  //     // Handle errors
  //     console.error('Error:', error);
  //     res.status(500).send('Internal Server Error');
  //   }
  // };

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
    const video = await this.videoService.findVideoByCreateId(user_id);
    console.log(user_id, video)
    return {
      video: video,
      status: '200 OK'
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
