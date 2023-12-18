import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExploration: false,
            secretOrKey: '${process.env.secret_jwt}'
        })
    }
    async validate(payload: {userId:number}){
        return{
            userId: payload.userId
        }
    }
}