import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './create-video.dto';
import { Video } from './video.entity';
// import * as fs from 'fs';
import * as fs from 'fs-extra'; 
import axios from 'axios';
import { HistoryObj } from './history_obj.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostService } from 'src/post/post.service';
import { PrivilegeService } from 'src/privilege/privilege.service';

require("dotenv").config();

@Injectable()
export class VideoService {

  constructor(
    @InjectRepository(Video)
    private historyRepository: Repository<Video>,
    private postService: PostService,private privilegeService: PrivilegeService
  ) { }


  // upload 
  async create(history_obj: HistoryObj, createVideoDto: CreateVideoDto, user_id: number) {

    const history_video = Video.create({
      user_create: user_id,
      video_name: history_obj.video_name,
      thumbnail_path:history_obj.thumbnail_path,
      video_origin_path: history_obj.video_origin_path,
      subtitle_path: history_obj.subtitle_path,
      sub_thai_path: history_obj.sub_thai_path,
      product_path: history_obj.product_path
    });

    await history_video.save();

    // return with video_id for download
    return {
      video_id: history_video.video_id,
      status: '200 OK'
    };

  }

  async get_contentBase64(video_id: number, user_id: number) {
    // const response = await axios.get(process.env.URL_ML);
    console.log('id', video_id)
    // search by id
    const video = await Video.findOne({ where: { video_id: video_id } })


    console.log(video)
    const response = await axios.post(process.env.URL_ML_Download, {
      filename: video.video_name
    });
    // return {
    //   content : response.data
    // };

    //check user_token and user create video same person
    if (video.user_create == user_id) {
      // delete row in table if user_create = null (mean anonymous)
      // console.log(video.user_create=='')
      if (video.user_create == 0) {
        this.historyRepository.delete(video_id);

        // delete file 
        await axios.post(process.env.URL_FILE_Delete, {
          filename: video.video_name
        });
      }
      return response;
    }
    // not same person
    else {
      return null;
    }
  }

  // download 
  async download(video_id: number, user_id: number) {
    try {

      const response = await this.get_contentBase64(video_id, user_id)

      if (response == null) {
        return 'user_token and user create video not same person';
      }
      else {
        return response.data;
      }


    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }

  // download subtitle
  async download_subtitle(video_id: number, user_id: number) {
    try {

      const response = await this.get_contentBase64(video_id, user_id)

      if (response == null) {
        return 'user_token and user create video not same person';
      }
      else {
        return {
          "subtitle_content": response.data.content_sub
        }
      }


    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }


  // download video
  async download_video(video_id: number, user_id: number) {
    try {
      const response = await this.get_contentBase64(video_id, user_id)

      if (response == null) {
        return 'user_token and user create video not same person';
      }
      else {
        return {
          "merge_video_content": response.data.content_merge
        }
      }


    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }

  // download video origin old
  async download_origin(video_id: number, user_id: number) {
    try {
      const response = await this.get_contentBase64(video_id, user_id)

      if (response == null) {
        return 'user_token and user create video not same person';
      }
      else {
        return {
          "origin_content": response.data.content_origin
        }
      }


    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }


  // // convert file base64
  // async convertFile(Content: string, filename: string) {
  //   Content = Content.replace(/^data:(.*?);base64,/, ""); // <--- make it any type
  //   Content = Content.replace(/ /g, '+'); // <--- this is important

  //   const path = '../upload/';

  //   fs.writeFile(`${path}${filename}`, Content, 'base64', function (err) {
  //     console.log(err);

  //     return 'error'
  //   });
  //   return `${path}${filename}`
  // }

  // new convert file by path
  async getPath_Check(video_id: number, user_id: number) {
    // const response = await axios.get(process.env.URL_ML);
    console.log('id', video_id)
    // search by video id
    const video = await Video.findOne({ where: { video_id: video_id } })

    console.log(video)
    // // lip reading
    // const response = await axios.post(process.env.new_Download, {
    //   filename: video.video_name
    // });

    // return {
    //   content : response.data
    // };

    //check user_token and user create video same person
    if (video.user_create == user_id) {
      console.log('same person')
      // delete row in table if user_create = null (mean anonymous)
      // console.log(video.user_create=='')
      if (video.user_create == 0) {
        console.log('anony')
        this.historyRepository.delete(video_id);

        // delete file 
        // await axios.post(process.env.URL_FILE_Delete, {
        //   filename: video.video_name
        // });
        await fs.unlink(video.product_path);
        await fs.unlink(video.thumbnail_path);
        await fs.unlink(video.video_origin_path);
        await fs.unlink(video.subtitle_path);
      }
      console.log('before return', video)
      return video;
    }
    // not same person
    else {
      return null;
    }
  }
  // new download 
  async new_download(video_id: number, user_id: number) {
    try {

      const response = await this.getPath_Check(video_id, user_id)

      if (response == null) {
        return 'user_token and user create video not same person';
      }
      else {
        return response;
      }


    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }

  // download new subtitle
  async new_download_subtitle(video_id: number, user_id: number) {
    try {

      const response = await this.getPath_Check(video_id, user_id)

      // if (response == null) {
      //   return 'user_token and user create video not same person';
      // }
      // else {
      //   return {
      //     "sub_path": response.data.sub_path
      //   }
      // }
      if (response != null) {
        return {
          "sub_path": response.subtitle_path.substring(response.subtitle_path.lastIndexOf('/')+1)
        }
      }


    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }


  // download new video
  async new_download_video(video_id: number, user_id: number) {
    try {
      console.log('new_download_video')
      const response = await this.getPath_Check(video_id, user_id)

      // if (response == null) {
      //   return 'user_token and user create video not same person';
      // }
      // else {
      //   console.log(response)
      //   return {
      //     "merge_path": response.data.merge_path
      //   }
      // }
      console.log('res',response)
      if (response != null) {
        console.log('return')
        return {
          "merge_path": response.product_path.substring(response.product_path.lastIndexOf('/')+1)
        }
      }


    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }

  // download video origin old
  async new_download_origin(video_id: number, user_id: number) {
    try {
      const response = await this.getPath_Check(video_id, user_id)

      // if (response == null) {
      //   return 'user_token and user create video not same person';
      // }
      // else {
      //   return {
      //     "origin_path": response.data.origin_path
      //   }
      // }

      if (response != null) {
        return {
          "origin_path": response.video_origin_path.substring(response.video_origin_path.lastIndexOf('/')+1)
        }
      }


    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }

  //upload and process 
  async lipreading(createVideoDto: CreateVideoDto) {
    try {
      // const response = await axios.get(process.env.URL_ML);
      // // console.log(process.env.URL_ML)
      // console.log(createVideoDto.content)
      const response = await axios.post(process.env.URL_ML, {
        filename: createVideoDto.video_name,
        content: createVideoDto.content
      });
      console.log(response.data);

      // return '200 OK';

      return response.data
    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }

  async deleteVideo(video_id: number,user_id:number){

    // delete video thta in post db
    const post = await this.postService.findPostByVideoId(video_id)
    console.log(post)
    if(post!= null){
      await this.postService.deletePost(post.post_id)
      console.log('after delete post',post)
      // delete post that in privillege check userid and postid
      const privilege = await this.privilegeService.findbyPostId_UserId(user_id,post.post_id)
      console.log(privilege)
      if(privilege!= null){
        await this.privilegeService.delete_post(privilege.post_id)
      }
    }
    

    // delete in video db
    await Video.delete(video_id)

    return '200 OK'

  }

  // get frame subtitle eng
  async getVideoFrame(video_id: number) {
    try {
      // const response = await axios.get(process.env.URL_ML);
      // // console.log(process.env.URL_ML)
      // console.log(createVideoDto.content)
      const video = (await this.findFromId(video_id))
      // cut extendtion in video name
      const fileName = video.video_name.split('.')[0];
      console.log(fileName)

      // get frame eng,thai
      // const response = await axios.post(process.env.URL_Frame_Video, {
      //   filename: fileName
      // });
      // console.log('res:', response.data;
      // return response.data
      console.log(video.subtitle_path,video.subtitle_path)
      const eng_sub = await this.readSrtFile(video.subtitle_path)
      const thai_sub = await this.readSrtFile(video.sub_thai_path)


      const sub_eng = eng_sub.map(item => ({
        start: item.start.replace(',', '.').substring(0, 12),
        end: item.end.replace(',', '.').substring(0, 12),
        message: item.text?.trim() || '', // Use optional chaining and provide a default value
      }));

      const sub_thai = thai_sub.map(item => ({
        start: item.start.replace(',', '.') .substring(0, 12),
        end: item.end.replace(',', '.').substring(0, 12),
        message: item.message.trim() // Access 'message' directly for Thai subtitles
      }));


      return {
        sub_eng: sub_eng,
        sub_thai: sub_thai
      };
    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }

  async readSrtFile(file_path: string){
    const srtFormat = [];
    
    const fileContent = fs.readFileSync(file_path, { encoding: 'utf-8' });
    const lines = fileContent.split('\n');
    
    let entry: any = {};
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (!isNaN(parseInt(trimmedLine))) {
        if (Object.keys(entry).length !== 0) {
          srtFormat.push(entry);
        }
        entry = { id: parseInt(trimmedLine) };
      } else if (trimmedLine.includes(' --> ')) {
        const [start, end] = trimmedLine.split(' --> ');
        entry.start = start;
        entry.end = end;
      } else if (trimmedLine !== '') {
        entry.text = entry.text ? entry.text + ' ' + trimmedLine : trimmedLine;
      }
    }

    if (Object.keys(entry).length !== 0) {
      srtFormat.push(entry);
    }

    return srtFormat;
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
        user_create: id
      }
    });
  }

  async findFromId(id: number) {
    return await Video.findOne({
      where: {
        video_id: id
      }
    });
  }


}
