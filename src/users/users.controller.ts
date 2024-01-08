import { Body, Controller, Get, Param, Post, Response } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,private readonly authService: AuthService) {}


  @Post('register')
  async create_user(@Body() createUserDto:CreateUserDto){
    // const birthdayDate = new Date(sign_up.birthday);
    // sign_up.birthday = birthdayDate;
    // const createUserDto : sign_up
    console.log('register')
    const status =  await this.usersService.create(createUserDto);
    if (status != '200 OK'){
      return {
        status :status
      }
    }
    else{
      // login and get token
      const access_token = await this.authService.login({
        "email" : createUserDto.email,
        "username" : createUserDto.username,
        "password" : createUserDto.password
      })

      // console.log("test",access_token)

      return {
        access_token : access_token,
        status : status
      }
    }
    

  }

  @Get(':id')
  show(@Param('id') id: string){
    return this.usersService.showById(+id);
  }

  // check user bu Email
  @Post('checkUser')
  async checkUser(@Body() take, @Response() res){
    const user = await this.usersService.findByEmail(take.email);
    console.log(user);
    if (user == null){
      res.status(404).json({ message: `User with ID not found` });
      return ;
    }
    else{
      res.status(200).json({ message: `success` });
      return ;
    }
  }
}
