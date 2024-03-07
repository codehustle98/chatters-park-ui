import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {User} from "../model/user.model";

@Injectable()
export class UserService{
  private API_URL=environment.apiUrl;

  private user:Subject<User> = new BehaviorSubject<User>({});
  constructor(private _httpClient:HttpClient) {
  }

  login(user:any,isLogin:boolean){
    const url = isLogin ? `${this.API_URL}user/login` : `${this.API_URL}user/signup`;
    return this._httpClient.post(url,user,{observe:'response'});
  }

  getUser(){
    return this._httpClient.get(`${this.API_URL}user`);
  }

  getOnlineUsers():Observable<User>{
    return this._httpClient.get(`${this.API_URL}user/active`);
  }

  setUser(user:User):void{
    this.user.next(user);
  }

  subscribeForUser():Observable<User>{
    return this.user.asObservable();
  }

}
