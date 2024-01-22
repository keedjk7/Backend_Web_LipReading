import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { TeamModule } from 'src/team/team.module';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { UsersService } from 'src/users/users.service';
import { PostService } from 'src/post/post.service';
import { UserWorkspaceService } from 'src/user_workspace/user_workspace.service';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { PostModule } from 'src/post/post.module';
import { UserWorkspaceModule } from 'src/user_workspace/user_workspace.module';

@Module({
  // imports:[
  //   UsersModule,
  //   // PrivilegeModule,
  //   forwardRef(() => TeamModule),
  //   PassportModule,
  //   JwtModule.registerAsync({
  //     imports: [ConfigModule],
  //     useFactory: async () => ({
  //       secret: '${process.env.JWT_SECRET}',
  //       // secret : 'L1PR3AD153184',
  //       signOptions: { expiresIn: '1d' },
  //     }),
  //     inject: [ConfigService]
  //   })
  // ],
  // controllers: [AuthController],
  // providers: [AuthService,
  //   JwtStrategy,
  //   PrivilegeService, // Include PrivilegeService here
  //   UsersService,
  //   PostService,
  //   UserWorkspaceService], // Include UsersService here],
  // exports:[AuthService]

  imports: [
    forwardRef(()=>UsersModule),
    forwardRef(()=>TeamModule),
    forwardRef(()=>PrivilegeModule),
    forwardRef(()=>UsersModule),
    forwardRef(()=>PostModule),
    forwardRef(()=>UserWorkspaceModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: '${process.env.JWT_SECRET}',
        signOptions: { expiresIn: '2h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}
