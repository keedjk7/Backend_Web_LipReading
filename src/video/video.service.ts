import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './create-video.dto';
import { Video } from './video.entity';

import * as fs from "fs";
import axios from 'axios';
import busboy from "busboy";
import { contains } from 'class-validator';
import { env } from 'process';

const CHUNK_SIZE_IN_BYTES = 1000000; // 1 mb
require("dotenv").config();

@Injectable()
export class VideoService {

  // upload
  async create(createVideoDto : CreateVideoDto){
    // console.log(createVideoDto);
    // // const temp = {
    // //   video_name : createVideoDto.video_name,
    // //   video_path : createVideoDto.video_path
    // // }
    // console.log(typeof createVideoDto.video_name , typeof createVideoDto.video_path)
    // const test = {video_name: 'test', video_path: 'test'}

    // // const video = Video.create(createVideoDto);
    // // const video = Video.create(test);
    // const video = Video.create({video_name: createVideoDto.video_name,video_path: createVideoDto.video_path});
    // await video.save();
    
    // return video;
    createVideoDto.content = createVideoDto.content.replace(/^data:(.*?);base64,/, ""); // <--- make it any type
    createVideoDto.content = createVideoDto.content.replace(/ /g, '+'); // <--- this is important
  
    const path = '../upload/';

    fs.writeFile(`${path}${createVideoDto.video_name}`, createVideoDto.content, 'base64', function(err) {

      const video = Video.create({video_name: createVideoDto.video_name,video_path: path});
      console.log(err);
      
      return 'error';
    });
      return 'save success';
  }

    // download
    async download(filename:string){
      try {
        // const response = await axios.get(process.env.URL_ML);
        // // console.log(process.env.URL_ML)
        console.log('download_back')
        const response = await axios.post(process.env.URL_ML_Download, {
          filename : filename
        });
        // return {
        //   content : response.data
        // };
        return response.data;
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
  
  async lipreading(createVideoDto : CreateVideoDto){
    try {
      // const response = await axios.get(process.env.URL_ML);
      // // console.log(process.env.URL_ML)
      console.log(createVideoDto.content)
      const response = await axios.post(process.env.URL_ML, {
        filename : createVideoDto.video_name,
        content : createVideoDto.content
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }



    
}
