import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    async create(createUserDto: CreateUserDto){
        try {
            console.log(createUserDto);
    
            const userWithSameEmail = await User.findOne({ where: { email: createUserDto.email } })
            const userWithSameUsername = await User.findOne({ where: { username: createUserDto.username } })

            if(userWithSameEmail && userWithSameUsername){
                return { status: '200 UEE' };
            }

            if (userWithSameEmail) {
                return { status: '200 EE' };
            }
    
            if (userWithSameUsername) {
                return { status: '200 UE' };
            }
    
            const user = User.create({
                ...createUserDto,
                birthday: new Date(createUserDto.birthday),
            });
    
            await user.save();
    
            delete user.password;
    
            return { status: '200 OK' };
        } catch (error) {
            throw error;
        }
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
        

    async showById(id: number):Promise<User>{
        const user = await this.findById(id);

        delete user.password;
        return user;
    }

    async findById(id: number) {
        return await User.findOne({
            where: {
                id:id
            }
        });
    }

    async findByEmail(email: string){
        return await User.findOne({
            where: {
                email:email
            }
        })
    }

    async findByUsername(username: string){
        return await User.findOne({
            where: {
                username:username
            }
        })
    }
}
