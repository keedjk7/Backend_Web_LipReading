import { Body, Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './auth-login.dto';
import { Response,Request } from 'express';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { TeamService } from 'src/team/team.service';


@Injectable()
export class AuthService {
    private readonly blacklistedTokens: Set<string> = new Set();

    constructor(
        // private userService: UsersService | null,
        private userService : UsersService,
        private teamService : TeamService,
        private jwtService : JwtService,
        private privilegeService : PrivilegeService
    ){}
    

    // login user
    async login(AuthLoginDto: AuthLoginDto){
        console.log(AuthLoginDto);
        // validation user
        const user = await this.validateUser(AuthLoginDto)


        console.log(user)
        const payload = { user_id: user.id };
        console.log(payload)

        // return {
        //     access_token: this.jwtService.sign(payload),
        //     status: '200 OK'
        // };
        const jwt_token =await this.jwtService.signAsync(payload);
        // const jwt_token = await this.jwtService.signAsync(payload,process.env.secret_jwt,{ expiresIn: '1d' });

        return jwt_token;
    }

    // validation
    async validateUser(authLoginDto: AuthLoginDto) {
        // check have username?
        if(authLoginDto.hasOwnProperty('username') == false){
            Object.assign(authLoginDto, {username: null});
            // Object.keys(object).forEach(key => object[key]=null);
        }
        // check else have email
        else if(authLoginDto.hasOwnProperty('email') == false){
            Object.assign(authLoginDto, {email: null});
        }
        const { email, username, password} = authLoginDto;

        console.log({ email, username, password})

        // validate By Email
        if (username == null){
            // const user = await this.userService.findByEmail(email);
            const user = await this.userService.findByEmail(email);
            if (!user){
                throw new UnauthorizedException('not found account');
            }
            // check with password
            if(!(await user?.validatePassword(password))){
                throw new UnauthorizedException('wrong password');
            }
            return user;
        }
        // validate By Username
        else{
            // const user = await this.userService.findByEmail(email);
            const user = await this.userService.findByUsername(username);
            if (!user){
                throw new UnauthorizedException('not found account');
            }
            // check with password
            if(!(await user?.validatePassword(password))){
                throw new UnauthorizedException('wrong password');
            }
            return user;
        }
    }
    // set cookie
    async setCookie(@Res() response: Response, token: string) {
        response.cookie('jwt-auth', token, { httpOnly: true });

        console.log('set cookie');

        return {
            access_token: token,
            status: '200 OK'
        };
    }

    // check token and return user info
    // async checkToken_get_user(@Req() request:Request){
    async checkToken_get_user(access_token:string){
        try{    
            // const cookie = request.cookies['jwt-auth'];

            const info = await this.jwtService.verifyAsync(access_token);

            if(!info){
                throw new UnauthorizedException('Token Invalid')
            }
            // console.log(info)
            const user = await this.userService.findById(info.user_id);

            user.profile_image = user.profile_image.substring(user.profile_image.lastIndexOf('/')+1)
        
            return user;
        }catch(e){
            throw new UnauthorizedException('Not Found Token')
        }
    }

    async getUserByToken(access_token:string){
        const info = await this.jwtService.verifyAsync(access_token);

        if(!info){
            throw new UnauthorizedException('Token Invalid')
        }
        // console.log('checkToken',info)

        return info.user_id;
    }

    async checkToken_get_team(access_token:string){
        try{
            // console.log(request);
            // const cookie = request.cookies['jwt-auth'];

            const info = await this.jwtService.verifyAsync(access_token);

            if(!info){
                throw new UnauthorizedException('Token Invalid')
            }
            console.log(info)
            let teamObjBefore = await this.privilegeService.findTeamByUser(info.user_id);

            let teamObj = []

            // not get offline team
            for(let i=0;i<teamObjBefore.length;i++){
                const team = await this.teamService.TeamfindById(teamObjBefore[i].team_id)
                if(team.team_status != 'Offline'){
                    teamObj.push(teamObjBefore[i])
                }
            }
            
            // console.log(teamObj);

            const team_ids = teamObj.map(value => value.team_id);
            // for (let i = 0; i < team.length; i++){
            //     console.log(,team[i])
            //  }
            // // get team data obj
            // const team_data = await Promise.all(team_id.map(id => this.teamService.findById(id)));
            // console.log('team_id',team_id);
            // console.log(team_data);
            // // get role user each team obj
            // const roleObj = await this.privilegeService.findTeamByUser(info.user_id);
            // console.log(roleObj);

            // // get number of member each team
            // const memberObj = await Promise.all(team_id.map(id => this.privilegeService.countMemberTeam(id)));
            // console.log('count_member',memberObj);
        
            // // return team_data;
            // Fetch team data for each team id
            const teamDataPromises = team_ids.map(id => this.teamService.TeamfindById(id));
            const teamsDataArray = await Promise.all(teamDataPromises);

            // Flatten the array if it's an array of arrays
            const teamsData = teamsDataArray.flat();

            // Fetch roles for each team
            const rolesPromises = teamObj.map(privilege =>
            this.privilegeService.findPrivilegeByUserAndTeam(info.user_id, privilege.team_id)
            );
            const rolesData = await Promise.all(rolesPromises);

            // Get number of members for each team
            const memberCountPromises = team_ids.map(id => this.privilegeService.countMemberTeam(id));
            const memberCountData = await Promise.all(memberCountPromises);

            // Combine team data with roles and member counts
            const mergedData = teamsData.map((team, index) => ({
            team_id: team.team_id,
            team_name: team.team_name,
            picture_team: team.picture_team.substring(team.picture_team.lastIndexOf('/')+1),
            role: rolesData[index]?.role,
            count_member: memberCountData[index]?.count_member, // Adding count_member to mergedData
            }));

            return mergedData;

        }catch(e){
            throw new UnauthorizedException('Not Found Token')
        }
    }


    // logout
    async logout(@Res() response: Response, access_token: string): Promise<any> {
        // Add the token to the blacklist
        // this.blacklistedTokens.add(access_token);
        console.log(access_token)

        const user_id = await this.getUserByToken(access_token);
    
        // Clear the cookie on the client side
        response.clearCookie('jwt-auth');
    
        console.log('log out');

        if(user_id!=null){
             return {
          status: '200 OK',
        };
        }
        else{
            return '401 Unauthenticated'
        }
    
       
      }
}
