import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './auth-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() authLoginDto: AuthLoginDto){
    console.log(authLoginDto);
    // return access token
    return this.authService.login(authLoginDto);
  }

  // check access token
  @UseGuards(JwtAuthGuard)
  @Get()
  async test(){
    return "Success Login";
  }
}
