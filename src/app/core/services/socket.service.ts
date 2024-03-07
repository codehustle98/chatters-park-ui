import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import {Observable, Subject} from "rxjs";
import {UserService} from "./user.service";
@Injectable()
export class SocketService{

  private SOCKET_END_POINT:string=environment.socketUrl;
  private stompClient:any;

  private USER_CONNECT_URL = "/app/user.connect";
  private PUBLIC_TOPIC_NAME = "/public/topic";

  private isUserConnected=new Subject<boolean>();
  private connectedUsers=new Subject();
  private publicMessages=new Subject();
  private userDisconnect=new Subject();

  private currentUser:any;

  constructor(private _userService:UserService) {
    this._userService
      .subscribeForUser()
      .subscribe(user => this.currentUser = user);
  }

  connect(){
    const ws = new SockJs(this.SOCKET_END_POINT);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({'Authorization':localStorage.getItem('token')},(frame:any)=>{
      this.subscribeToPublicChannel();
      this.setIsUserConnected(true);
    });
  }

  disconnect(){
    if(this.stompClient != null){
      this.stompClient.disconnect(()=>{
        this.stompClient = null;
        this.setUserDisconnected(true);
      });
    }
  }

  publishUserConnected(){
    this.stompClient.send(this.USER_CONNECT_URL);
  }

  subscribeToPublicChannel(){
    this.stompClient
      .subscribe(this.PUBLIC_TOPIC_NAME,(message:any)=>{
        this.handleMessage(JSON.parse(message.body));
      });
  }

  publishMessageToChannel(channel:string,message?:any){
    this.stompClient.send(channel,{},JSON.stringify(message))
  }

  private handleMessage(message:any){
    let msg = message.length > 0 ? message[0] : message;
    switch (msg.messageType){
      case "JOIN":
        this.connectedUsers.next(message.users);
        break;
      case "CHAT":
        this.publicMessages.next(message);
        break;
      case "LEAVE":
        this.connectedUsers.next(message.users);
        const loggedInUser = message.users.filter((user:any) => user.userId === this.currentUser.userId).length === 0;
        if(loggedInUser) {
          this.disconnect();
        }
    }
  }

  public subscribeForPublicMsg(){
    return this.publicMessages.asObservable();
  }

  private setIsUserConnected(isConnected:boolean):void{
    this.isUserConnected.next(isConnected);
  }

  public subscribeForUserConnection():Observable<boolean>{
      return this.isUserConnected.asObservable();
  }

  public subscribeForConnectedUsers(){
    return this.connectedUsers.asObservable();
  }

  private setUserDisconnected(status:boolean){
    this.userDisconnect.next(status);
  }

  public subscribeForUserDisconnected(){
    return this.userDisconnect.asObservable();
  }

}
