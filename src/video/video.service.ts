import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './create-video.dto';
import { Video } from './video.entity';

import axios from 'axios';
import { HistoryObj } from './history_obj.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

require("dotenv").config();

@Injectable()
export class VideoService {

  constructor(
    @InjectRepository(Video)
    private historyRepository: Repository<Video>,
  ) {}


  // upload 
  async create(history_obj:HistoryObj,createVideoDto:CreateVideoDto,user_id : number){

    const history_video = Video.create({
      user_create: user_id,
      video_name: history_obj.video_name,
      video_origin_path: history_obj.video_origin_path,
      subtitle_path: history_obj.subtitle_path,
      product_path: history_obj.product_path
    });

    await history_video.save();

    // return with video_id for download
    return { video_id : history_video.video_id,
      status: '200 OK' };

  }

  // download 
  async download(video_id:number,user_id:number){
      try {
      // const response = await axios.get(process.env.URL_ML);
      console.log('id',video_id)
      // search by id
      const video = await Video.findOne({ where: { video_id: video_id } })

  
      console.log(video)
      const response = await axios.post(process.env.URL_ML_Download, {
        filename : video.video_name
      });
      // return {
      //   content : response.data
      // };
      console.log('get_ml')

      //check user_token and user create video same person
      if(video.user_create == user_id){
        // delete row in table if user_create = null (mean anonymous)
        // console.log(video.user_create=='')
        if (video.user_create == 0){
           this.historyRepository.delete(video_id);
      
          // delete file 
          await axios.post(process.env.URL_FILE_Delete, {
            filename : video.video_name
          });
        }
       

        return response.data;   
      }
      // not same person
      else{
        return 'user_token and user create video not same person';
      }

      
    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }

  // // convert file
  // async convertFile(Content:string,filename:string){
  //   Content = Content.replace(/^data:(.*?);base64,/, ""); // <--- make it any type
  //   Content = Content.replace(/ /g, '+'); // <--- this is important
  
  //   const path = '../upload/';
    
  //   fs.writeFile(`${path}${filename}`, Content, 'base64', function(err) {
  //   console.log(err);
    
  //   return 'error'
  //   });
  //   return `${path}${filename}`
  // }

  //upload and process 
  async lipreading(createVideoDto : CreateVideoDto){
    try {
      // const response = await axios.get(process.env.URL_ML);
      // // console.log(process.env.URL_ML)
      // console.log(createVideoDto.content)
      const response = await axios.post(process.env.URL_ML, {
        filename : createVideoDto.video_name,
        content : createVideoDto.content
      });
      console.log(response.data);

      // return '200 OK';

      return response.data
    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }

  // async getHistory(username: string): Promise<Video[]> {
  //   const history = await this.historyRepository.find({ where: { user_create:username } });
  //   // return history;

  //   // get file from ml
  //   // const response = await axios.post(process.env.URL_FILE_Get, {
  //   //   filename : createVideoDto.video_name,
  //   //   content : createVideoDto.content
  //   // });
  //   // const results = await Promise.all(history.map(async (item) => {
  //   //   const response = await axios.post(process.env.URL_FILE_Get, { path: item.path });
  //   //   return response.data;
  //   // }));
  //   return history;
  // }
  async findVideoByCreateId(id: number) {
    return await Video.find({
        where: {
            user_create:id
        }
    });
}

    
}
