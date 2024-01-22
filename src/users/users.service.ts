import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { AuthService } from 'src/auth/auth.service';
import { EditProfileDto } from 'src/profile/edit-profile.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        // private authService: AuthService,
      ) { }
    // constructor(
    //     private authService : AuthService,
    // ){}

    // create user
    async create(createUserDto: CreateUserDto) {
        try {
            console.log(createUserDto);

            const userWithSameEmail = await User.findOne({ where: { email: createUserDto.email } })
            const userWithSameUsername = await User.findOne({ where: { username: createUserDto.username } })

            if (userWithSameEmail && userWithSameUsername) {
                return '200 UEE'
            }

            if (userWithSameEmail) {
                return '200 EE'
            }

            if (userWithSameUsername) {
                return '200 UE'
            }

            const user = User.create({
                ...createUserDto,
                birthday: new Date(createUserDto.birthday),
                account_status: 'Online'
            });

            await user.save();

            delete user.password;

            return '200 OK'
        } catch (error) {
            throw error;
        }
    }

    // Offline user account
    async Offline_user(change_account_id) {

        try {
            const Offline_user = await this.findById(change_account_id);
            if (Offline_user.account_status == 'Online') {
                Offline_user.account_status = 'Offline';
                await User.update(Offline_user.id, Offline_user);

                return '200 OK';
            }
            else {
                return '409 Conflict'
            }

        }
        catch (error) {
            // return 'not found this account';
            throw error;
        }
    }

    // Online user account
    async Online_user(change_account_id) {

        try {
            const Onlinek_user = await this.findById(change_account_id);
            if (Onlinek_user.account_status == 'Offline') {
                Onlinek_user.account_status = 'Online';
                await User.update(Onlinek_user.id, Onlinek_user);

                return 'Online user success';
            }
            else {
                return 'this account has already Online'
            }

        }
        catch (error) {
            // return 'not found this account';
            throw error;
        }
    }
    async new_password(user_id:number,new_password:string){
        // console.log(token.access_token);

        // old user data
        let change_data = await this.findById(user_id)
        // console.log(change_data)

        // password
        if (new_password != undefined){
            change_data.password = new_password;
        }


        console.log('new_password',change_data)
        await User.update(user_id,change_data);

        return '200 OK'

    }

    async delete_account(user_id:number){
        this.userRepository.delete(user_id);

        return '200 OK'
    }


    // console.log(createUserDto);
    // // // const user = User.create(createUserDto);
    // // // // แปลง bithday
    // // const test = createUserDto.birthday;
    // // console.log(test);
    // // const test_date = new Date(test);
    // // console.log('test',test_date);

    // // const birthdayDate = new Date(createUserDto.birthday);
    // // console.log(birthdayDate);
    // // user.birthday = birthdayDate;
    // const user = User.create({
    //     ...createUserDto,
    //     birthday: new Date(createUserDto.birthday), // แปลงเป็น Date
    // });
    // await user.save();

    // delete user.password;
    // return {
    //     status: '200 OK'
    // };

    // check user in data by Email
    async checkEmailUser(email: string) {
        const user = await this.findByEmail(email);
        console.log(user);
        if (user != null) {
            return 'Found Account'
        }
        else {
            return 'Not Found Account'
        }
    }

    // check user in data by Username
    async checkUsernameUser(username: string) {
        const user = await this.findByUsername(username);
        console.log(user);
        if (user != null) {
            return 'Found Account'
        }
        else {
            return 'Not Found Account'
        }
    }

    // async searchUsersByText(text: string){
    //     try {
    //         const users = await this.userRepository
    //           .createQueryBuilder('user')
    //           .where('user.email LIKE :searchText', { searchText: `%${text}%` })
    //           .orWhere('user.username LIKE :searchText', { searchText: `%${text}%` })
    //           .orWhere('user.surname LIKE :searchText', { searchText: `%${text}%` })
    //           .orWhere('user.lastname LIKE :searchText', { searchText: `%${text}%` })
    //           .getMany();

    //         return users;
    //       } catch (error) {
    //         console.error('Error occurred while searching users:', error);
    //         return [];
    //       }
    // }


    async showById(id: number): Promise<User> {
        const user = await this.findById(id);

        delete user.password;
        return user;
    }

    async findById(id: number) {
        return await User.findOne({
            where: {
                id: id
            }
        });
    }

    async findByEmail(email: string) {
        console.log(email)
        return await User.findOne({
            where: {
                email: email
            }
        })
    }

    async findByUsername(username: string) {
        return await User.findOne({
            where: {
                username: username
            }
        })
    }

    async getAllUser(){
        return await User.find();
    }
}
