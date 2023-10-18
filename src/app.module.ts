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

require("dotenv").config();
const entities = [User,Video]

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
    }),
    UsersModule,
    AuthModule,
    VideoModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
