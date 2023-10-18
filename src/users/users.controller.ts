import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
