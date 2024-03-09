import {NgModule} from "@angular/core";
import {SocketService} from "./services/socket.service";
import {UserService} from "./services/user.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpRequestInterceptor} from "./interceptors/http-request.interceptor";
import {MessagesService} from "./services/messages.service";
import {SearchListPipe} from "./pipes/search-list.pipe";
import {LoadingService} from "./services/loading.service";

const providers:any[] = [
  SocketService,
  UserService,
  MessagesService,
  LoadingService
]
@NgModule({
  declarations:[
    SearchListPipe
  ],
  providers:[
    ...providers,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:HttpRequestInterceptor,
      multi: true
    }
  ],
  exports:[
    SearchListPipe
  ]
})
export class CoreModule{}
