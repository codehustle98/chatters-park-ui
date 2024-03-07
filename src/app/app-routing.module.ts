import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ChatRoomComponent} from "./chat-room/chat-room.component";

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'chat',component:ChatRoomComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
