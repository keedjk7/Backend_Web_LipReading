import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { Video } from './video/video.entity';
import { TeamModule } from './team/team.module';
import { Team } from './team/team.entity';
import { PrivilegeModule } from './privilege/privilege.module';
import { Privilege } from './privilege/privilege.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserWorkspaceModule } from './user_workspace/user_workspace.module';
import { PostModule } from './post/post.module';

require("dotenv").config();
const entities = [User,Video,Team,Privilege]

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      // type : process.env.DB_TYPE as 'mysql',
      // type : 'mysql',
      // host : process.env.DB_HOST,
      // port : parseInt(process.env.PORT),
      // username : process.env.USER,
      // database : process.env.DB_NAME,
      // entities : entities,
      // synchronize : true,
      type : 'mysql',
      host : 'localhost',
      port : 3306,
      username : 'root',
      database : 'back_lip',
      entities : entities,
      synchronize : true,

      // type : 'postgres',
      // host : process.env.PostgreSQL_Host,
      // port : parseInt(<string>process.env.PostgreSQL_Port),
      // username : process.env.PostgreSQL_User,
      // password : process.env.PostgreSQL_Password,
      // database : process.env.PostgreSQL_Database,
      // autoLoadEntities : true,
      // synchronize : true,
    }),
    JwtModule.register({
      secret: process.env.secret_jwt,
      signOptions: {expiresIn: '6h'}
    }),
    UsersModule,
    AuthModule,
    VideoModule,
    TeamModule,
    PrivilegeModule,
    UserWorkspaceModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
