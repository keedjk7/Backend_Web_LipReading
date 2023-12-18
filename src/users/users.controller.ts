import { Body, Controller, Get, Param, Post, Response } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post('register')
  create_user(@Body() createUserDto:CreateUserDto){
    // const birthdayDate = new Date(sign_up.birthday);
    // sign_up.birthday = birthdayDate;
    // const createUserDto : sign_up
    return this.usersService.create(createUserDto);
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
