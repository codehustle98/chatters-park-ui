import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../core/services/user.service";

@Component({
  selector: 'app-chat-message-bubble',
  templateUrl: './chat-message-bubble.component.html',
  styleUrls: ['./chat-message-bubble.component.scss']
})
export class ChatMessageBubbleComponent implements OnInit {

  @Input() message:any;
  constructor(private _userService:UserService) { }

  ngOnInit(): void {

    this._userService
      .subscribeForUser().subscribe(user => {
        if(user.userId != this.message.userId){
          this.message.messageType = 'RECEIVE';
        }else{
          this.message.messageType = 'SEND';
        }
    })
  }

}
