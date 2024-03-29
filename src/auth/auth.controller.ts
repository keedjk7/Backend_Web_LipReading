import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './auth-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request,Response, response } from 'express';
import { TeamService } from 'src/team/team.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private readonly teamService: TeamService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto, @Res({passthrough:true}) response:Response){
    console.log(authLoginDto);
    // return access token
    const token = await this.authService.login(authLoginDto);
    console.log(token)
    // set cookie
    let return_obj = await this.authService.setCookie(response, token);

    
    const user_id = await this.authService.checkToken_get_user(return_obj.access_token)
    console.log(user_id)
    // user blcok (Offline)
    if(user_id.account_status == 'Offline'){
      return {
        status : '503 : Service unavailable'
      }
    }
    // user active (Online)
    else{
      // check if webadmin set status '200 OK WebAdmin'
      if(user_id.id == 0){
        return_obj.status = '200 OK WebAdmin'
      }

      return return_obj
    }
    
  }

  @Post('logout')
  logout(@Res({passthrough:true}) response:Response,@Body() token){
    return this.authService.logout(response,token.access_token);
  }

  @Post('check_token_user')
  async check_token_user(@Body() token) {
    // console.log(request);
    return await this.authService.checkToken_get_user(token.access_token);
  }

  @Post('check_token_team')
  async check_token_team(@Body() token) {
    console.log(token);
    try {
      const merge_data = await this.authService.checkToken_get_team(token.access_token);

      console.log(merge_data)
  
      // Iterate through each team object in merge_data and convert picture_team to base64
      const updatedMergeData = await Promise.all(merge_data.map(async (teamObj) => {
        try {
          // // base 64
          // const base64String = await this.teamService.imageToBase64(teamObj.picture_team);
          // console.log(base64String)
          // return { ...teamObj, picture_team: base64String };
          return teamObj;
        } catch (error) {
          // Handle errors during conversion for individual team objects
          console.error(`Error converting picture for team ${teamObj.team_name}: ${error.message}`);
          return teamObj; // Return the original team object in case of error
        }
      }));
      // console.log(updatedMergeData);
      return updatedMergeData;
    } catch (error) {
      throw new UnauthorizedException('Failed to fetch team data');
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('getCookie_user')
  // async getCookie_user(@Body() token) {
  //   return await this.authService.checkToken_get_user(token);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('getCookie_team')
  // async getCookie_team(@Body() token) {
  //   return await this.authService.checkToken_get_team(token);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post('test')
  // async test(@Body() token){
  //   return await this.jwtService.va
  // }


  // // check access token
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async test(){
  //   return "Success Login";
  // }
}
