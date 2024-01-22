import { Injectable } from '@nestjs/common';
import { CreateNotification } from './create-notification.dto';
import { Notification } from './notification.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { TeamService } from 'src/team/team.service';
import { InviteDto } from './invite.dto';

@Injectable()
export class NotificationService {
    constructor(
        private teamService: TeamService,
        private authService: AuthService,
        private usersService: UsersService,
        private privilegeService: PrivilegeService,
    ) { }

     // invite User
     async invite(inviteDto:InviteDto){
        // get user_id sender from token
        const sender_id = await this.authService.getUserByToken(inviteDto.access_token);

        console.log("invite",sender_id,inviteDto.access_token,inviteDto.email)

        // get user_id reciever from email
        const receiver = await this.usersService.findByEmail(inviteDto.email);

        // not found email receiver
        if(receiver == null){
            return {
                status:'404: Not Found Data'
            }
        }
        else{
            // conflict Notification
            const conflictNotification = await this.findSameNotification(sender_id,receiver.id,inviteDto.team_id)
            
            // never invite before
            // create notification to receiver
            if(conflictNotification == null){
                return await this.create_notification({
                    sender_id: sender_id,
                    receiver_id: receiver.id,
                    team_id: inviteDto.team_id,
                    role: inviteDto.role
                })
            }
            else{
                // delete old notitifcation and create new

                // delete old
                await this.delete_notification(conflictNotification.notification_id);

                return await this.create_notification({
                    sender_id: sender_id,
                    receiver_id: receiver.id,
                    team_id: inviteDto.team_id,
                    role: inviteDto.role
                })
            }
            
        }

        
    }

    // create new ()
    async create_notification(createNotification: CreateNotification) {
        try {
            console.log(createNotification);

            const notification = Notification.create({
                ...createNotification,
                status: 'Invite'
            });

            // const notification = Notification.create({
            //     context: 'invite to team notification',
            //     sender_id: 0,
            //     receiver_id: 3,
            //     team_id: 2,
            //     role: 'Admin',
            //     status: 'Invite'
            //   });

            await notification.save();


            return '200 OK'
        } catch (error) {
            throw error;
        }
    }

    // accapt
    async accept_notification(access_token: string, notification_id: number) {
        // get user_id
        const user_id = await this.authService.getUserByToken(access_token);

        // change status notification
        let change_data_notification = await this.findById(notification_id)

        console.log('accept',user_id,change_data_notification)
        // check user not same user received
        if (user_id != change_data_notification.receiver_id) {
            return '403 : Forbidden'
        }

        // // edit status
        // change_data_notification.status = 'accept'

        // console.log('edit status notification',change_data_notification)
        // await Notification.update(notification_id,change_data_notification);

        // delete notification
        await this.delete_notification(notification_id)

        // add previllage user in team
        await this.privilegeService.add_privilege({
            team_id: change_data_notification.team_id,
            user_id: user_id,
            role: change_data_notification.role,
            post_id: 0
        });
        console.log('add user to team')
        return {
            status:'200 OK'
        }

    }

    // decline
    async decline_notification(access_token: string, notification_id: number) {
        // get user_id
        const user_id = await this.authService.getUserByToken(access_token);

        // change status notification
        let change_data_notification = await this.findById(notification_id)

        console.log('decline',user_id,change_data_notification)
        // check user not same user received
        if (user_id != change_data_notification.receiver_id) {
            return {
                status :'403 : Forbidden'
            }
        }

        // // edit status
        // change_data_notification.status = 'decline'

        // console.log('edit status notification',change_data_notification)
        // await Notification.update(notification_id,change_data_notification);

        // delete notification
        await this.delete_notification(notification_id)

        return {
            status:'200 OK'
        }
    }

    // return all notification from this user
    async showNotification(access_token: string) {
        // get user_id
        const user_id = await this.authService.getUserByToken(access_token);

        const allNotificationReceiver = await this.findByReceiverUser(user_id);

        let edit_allNotificationReceiver = []

        console.log('showNotification',user_id,allNotificationReceiver)

        for (let i = 0; i < allNotificationReceiver.length; i++) {
            console.log(allNotificationReceiver[i])

            // find team image
            const team = await this.teamService.TeamfindById(allNotificationReceiver[i].team_id)

            // sender name
            const sender = await this.usersService.findById(allNotificationReceiver[i].sender_id)

            const edit = {
                team_image: team.picture_team,
                team_name : team.team_name,
                notification_id: allNotificationReceiver[i].notification_id,
                sender_name : sender.username
            }

            edit_allNotificationReceiver.push(edit);
        }

        return {
            notification :edit_allNotificationReceiver,
            status : '200 OK'
        }

    }

    // delete notification
    async delete_notification(notification_id: number) {
        console.log('delete notification', notification_id)
        // find all pri in this team
        const notification_delete = await Notification.findOne({
            where: {
                notification_id: notification_id,
            }
        });

        await Notification.delete(notification_delete.notification_id)
    }

    async findById(id: number) {
        return await Notification.findOne({
            where: {
                notification_id: id
            }
        });
    }

    async findByReceiverUser(id: number) {
        return await Notification.find({
            where: {
                receiver_id: id
            }
        });
    }

    async findSameNotification(sender_id:number,receiver_id: number,team_id:number) {
        return await Notification.findOne({
            where: {
                sender_id:sender_id,
                receiver_id: receiver_id,
                team_id:team_id
            }
        });
    }


}
