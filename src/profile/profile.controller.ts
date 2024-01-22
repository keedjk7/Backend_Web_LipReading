import { Controller, Post, Body, Res, StreamableFile, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Response } from 'express';
import { ProfileService } from './profile.service';
import { AuthService } from 'src/auth/auth.service';
import { join, extname } from 'path';
import { createReadStream } from 'fs';
import { UsersService } from 'src/users/users.service';
import { EditProfileDto } from './edit-profile.dto';
import { FileHandleService } from 'src/file-handle/file-handle.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as bcrypt from 'bcryptjs' ;

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService, private readonly authService: AuthService
    , private readonly usersService: UsersService, private readonly fileHandleService: FileHandleService) { }

  // profileImage
  // @Post('imageProfile')
  // async getImageProfile(
  //   @Body() token,
  //   @Res({ passthrough: true }) res: Response
  // ): Promise<StreamableFile | string> {
  //   console.log(token.access_token);

  //   // get user_id
  //   const user_id = await this.authService.getUserByToken(token.access_token);

  //   // get user image profile
  //   const user = await this.usersService.findById(user_id);

  //   if (user.profile_image == null) {
  //     return 'not have profile image';
  //   } else {
  //     console.log(user);
  //     const imagePath = join(process.cwd(), user.profile_image);


  //     // Use the FileService to handle file download
  //     // return this.fileHandleService.downloadFile(imagePath, res);
  //   }
  // }
  @Post('imageProfile')
  async getImageProfile(@Body() token,) {
    try{
       console.log(token.access_token);

      // get user_id
      const user_id = await this.authService.getUserByToken(token.access_token);

      // get user image profile
      const user = await this.usersService.findById(user_id);

      if (user.profile_image == null) {
        return 'not have profile image';
      } else {
        console.log(user);

        return {
          profile_path: user.profile_image
        }

      }
    }
    catch(error){
      throw (error)
    }
   
  }

  // ProfileInfo
  // @Post('profileInfo')
  // async profileInfo(
  //   @Body() token,
  //   @Res({ passthrough: true }) res: Response
  // ): Promise<{ image: StreamableFile | string; userData: any }> {
  //   console.log(token.access_token);

  //   // get user_id
  //   const user_id = await this.authService.getUserByToken(token.access_token);

  //   // get user image profile
  //   const user = await this.usersService.findById(user_id);

  //   if (user.profile_image == null) {
  //     return { image: 'not have profile image', userData: null };
  //   } else {
  //     console.log(user);
  //     const imagePath = join(process.cwd(), user.profile_image);

  //     const result = await this.fileHandleService.downloadFile(imagePath, res);

  //     return {
  //       image: result,
  //       userData: { email: user.email, birthdate: user.birthday },
  //     };
  //   }
  // }
  @Post('profileInfo')
  async profileInfo(@Body() token,) {
    console.log(token.access_token);

    // get user_id
    const user_id = await this.authService.getUserByToken(token.access_token);

    // get user image profile
    const user = await this.usersService.findById(user_id);

    if (user.profile_image == null) {
      return {
        profile_image_path: null,
        email: user.email,
        birthdate: user.birthday,
      };
    } else {
      console.log(user);

      return {
        username: user.username,
        profile_image_path: user.profile_image,
        email: user.email,
        birthdate: user.birthday,
        status: '200 OK'
      };
    }
  }

  // Edit User
  @Post('EditProfile')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './user_profile_image/',
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async editProfile(@UploadedFile() file: Express.Multer.File, @Body() editProfileDto: EditProfileDto) {
    console.log(file);
    console.log(editProfileDto)

    // if (!file || !file.path || !file.originalname) {
    //   // Handle the case where file properties are missing
    //   throw new Error('Invalid file data');
    // }

    // // form data
    // const formData = new FormData();
    // const fileStream = fs.createReadStream(file.path);

    // formData.append('file', fileStream, { filename: file.originalname });

    // get user_id
    const user_id = await this.authService.getUserByToken(editProfileDto.access_token);

    // get user image profile
    const user = await this.usersService.findById(user_id);

    if ((!file || !file.path || !file.originalname) && (user.username == editProfileDto.username && user.email == editProfileDto.email && user.birthday == editProfileDto.birthday)) {
      // Handle the case where file properties are missing
      // throw new Error('Invalid file data');
      return '200 OK'
    }

    if (!file) {
      return this.profileService.edit_save_user(editProfileDto, undefined)
    }
    // have file sent to
    else {
      // delete old image
      const delete_file_status = await this.fileHandleService.deleteFile(user.profile_image)

      return this.profileService.edit_save_user(editProfileDto, file.path)
    }
  }

  // change password
  @Post('change_password')
  async changePassword(@Body() body) {
    console.log(body)

    // get user_id
    const user_id = await this.authService.getUserByToken(body.access_token);

    // get user image profile
    const user = await this.usersService.findById(user_id);

    //  check old password
    try {
      const check_user_password = await this.authService.validateUser({
        email: user.email,
        username: user.username,
        password: body.old_password
      })
      console.log(check_user_password)
    }
    catch{
      return "300 W"
    }

     // set new password
     const new_password = body.new_password;

     // Hash the new password
     const hashedPassword = await bcrypt.hash(new_password, 8);

    const status = await this.usersService.new_password(user_id, hashedPassword)
    return {
      status: status
    }
  }

  // delete account
  @Post('delete_account')
  async deleteAccount(@Body() body) {
    console.log(body)

    // get user_id
    const user_id = await this.authService.getUserByToken(body.access_token);

    // get user image profile
    const user = await this.usersService.findById(user_id);

    // delete account
    const status = await this.usersService.delete_account(user_id)

    return {
      status: status
    }
  }
}
