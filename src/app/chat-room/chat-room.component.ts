import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "../core/services/socket.service";
import {UserService} from "../core/services/user.service";
import {User} from "../core/model/user.model";
import {Router} from "@angular/router";
import {MessagesService} from "../core/services/messages.service";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit,AfterViewChecked {

  @ViewChild('chatContainer') private scrollContainer:any;

  users:User[]=[];
  user:User|undefined;
  maleAvatar:string="./assets/imgs/male_avatar.jpg";
  femaleAvatar:string="./assets/imgs/female_avatar.jpg"
  messages:any[]=[];
  message:string|undefined;
  constructor(private _socketService:SocketService,
              private _userService:UserService,
              private router:Router,
              private _messagesService:MessagesService) {
  }

  ngAfterViewChecked() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.log(err);
    }
  }

  subscribeForEvents(){
    this._socketService
      .subscribeForUserConnection()
      .subscribe(isConnected => {
        if(isConnected){
          this._socketService.publishUserConnected();
        }
      });

    this._socketService
      .subscribeForConnectedUsers()
      .subscribe((users:any)=>{
        this.users = users;
      });

    this._socketService
      .subscribeForPublicMsg()
      .subscribe(messages=>{
        this.messages.push(messages);
      });

    this._socketService
      .subscribeForUserDisconnected()
      .subscribe(status=>{
        localStorage.clear();
        this.router.navigate(['']);
      });
  }

  ngOnInit(): void {
    this.users=[];
    this.messages=[];
    this.getUser();
    this.getMessages();
    this.subscribeForEvents();
    this._socketService.connect();
  }

  getUser(){
    this._userService
      .getUser()
      .subscribe((user:any)=>{
        this.user = user;
        this._userService.setUser(user);
      });
  }

  getMessages(){
    this._messagesService
      .getMessages()
      .subscribe((messages:any)=>{
        if(messages) {
          this.messages = messages;
        }
      });
  }

  sendMessage(){
    this._socketService
      .publishMessageToChannel("/app/user.chat",{
        'userId':this.user?.userId,
        'username':this.user?.username,
        'message': this.message
      });
    this.message='';
  }

  logoutUser(){
    this._socketService
      .publishMessageToChannel("/app/user.disconnect")
  }

}
