import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './auth-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService : UsersService,
        private jwtService : JwtService,
    ){}

    async login(AuthLoginDto: AuthLoginDto){
        console.log(AuthLoginDto);
        const user = await this.validateUser(AuthLoginDto)

        const payload ={
            userId : user.id
        };

        return {
            access_token: this.jwtService.sign(payload),
            status: '200 OK'
        };
    }

    async validateUser(authLoginDto: AuthLoginDto) {
        if(authLoginDto.hasOwnProperty('username') == false){
            Object.assign(authLoginDto, {username: null});
            // Object.keys(object).forEach(key => object[key]=null);
        }
        else if(authLoginDto.hasOwnProperty('email') == false){
            Object.assign(authLoginDto, {email: null});
        }
        const { email, username, password} = authLoginDto;

        // By Email
        if (username == null){
            // const user = await this.userService.findByEmail(email);
            const user = await this.userService.findByEmail(email);
            if(!(await user?.validatePassword(password))){
                throw new UnauthorizedException();
            }
            return user;
        }
        // By Username
        else{
            // const user = await this.userService.findByEmail(email);
            const user = await this.userService.findByUsername(username);
            if(!(await user?.validatePassword(password))){
                throw new UnauthorizedException();
            }
            return user;
        }
    }
}
