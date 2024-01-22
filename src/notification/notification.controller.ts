import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotification } from './create-notification.dto';
import { error } from 'console';
import { InviteDto } from './invite.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // invite
  
  // case 1 user
  @Post('inviteUser')
  async inviteUser(@Body() inviteDto:InviteDto){
    // return this.notificationService.create_notification(createNotification);
    return this.notificationService.invite(inviteDto)
  }

  // case list user
  @Post('inviteUsers')
  async inviteUsers(@Body() createNotificationList: CreateNotification[]){
    try{
      for(let i=0;i<createNotificationList.length;i++){
        const status = this.notificationService.create_notification(createNotificationList[i]);
      }
      return {
        status:'200 OK'
      }
    }
    catch{
      return (error)
    }
    
  }

  // accept
  @Post('accept')
  async acceptInvite(@Body() body){
    return this.notificationService.accept_notification(body.access_token,body.notification_id);
  }

  // decline
  @Post('decline')
  async declineInvite(@Body() body){
    return this.notificationService.decline_notification(body.access_token,body.notification_id);
  }

  // return all notification from this user
  @Post('showAllNotificationUser')
  async showNotification(@Body() token){
    return this.notificationService.showNotification(token.access_token);
  }

}
