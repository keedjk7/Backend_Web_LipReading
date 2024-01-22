import { Injectable } from '@nestjs/common';
import { EditProfileDto } from './edit-profile.dto';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class ProfileService {
    constructor(
        // @InjectRepository(User)
        // private userRepository: Repository<User>,
        private authService: AuthService,
        private usersService: UsersService,
      ) { }
    // 
    async edit_save_user(editProfileDto:EditProfileDto,imagePath:string){
        console.log('edit user',editProfileDto.access_token);

        // get user_id
        const user_id = await this.authService.getUserByToken(editProfileDto.access_token);

        let change_data = await this.usersService.findById(user_id)
        // console.log(change_data)

        // username
        if (editProfileDto.username != undefined){
            change_data.username = editProfileDto.username;
        }
        
        // email
        if (editProfileDto.email != undefined){
            change_data.email = editProfileDto.email ;
        }

        // birthday 
        if (editProfileDto.birthday != undefined){
            change_data.birthday = editProfileDto.birthday ;
        }

        // profile image
        change_data.profile_image = imagePath ;

        console.log('edit user',change_data)
        await User.update(user_id,change_data);

        return '200 OK'

    }

}
