import { Module, Post } from '@nestjs/common';
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
import { TeamPostPageModule } from './team_post_page/team_post_page.module';
import { Posts } from './post/posts.entity';

require("dotenv").config();
const entities = [User,Video,Team,Privilege,Posts]

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      // // local
      // type : process.env.DB_TYPE as 'mysql',
      // // type : 'mysql',
      // host : process.env.DB_HOST,
      // port : parseInt(process.env.DB_PORT),
      // username : process.env.DB_USER,
      // // password: process.env.DB_PASSWORD,
      // // password: null,
      // database : process.env.DB_NAME,
      // entities : entities,
      // synchronize : true,
      // // database : process.env.DB_NAME,

      // type: 'mysql',
      // host: 'mysql',
      // port: 3306,
      // username: 'root',
      // password: 'temppwd1234',
      // database: 'back_lip',
      // entities: entities,
      // synchronize: true,

       // server
      type: 'mysql',
      // host: 'host.docker.internal', // Use the actual IP address of the MySQL container
      port: 3306,
      host: process.env.DB_HOST,
      username: 'root',
      password: 'temppwd1234',
      database: 'back_lip',
      entities: entities,
      synchronize: false,
      
      // type : 'mysql',
      // host : 'localhost',
      // port : 3306,
      // username : 'root',
      // database : 'back_lip',
      // entities : entities,
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
    TeamPostPageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
