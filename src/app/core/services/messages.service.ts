import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable()
export class MessagesService{

  private API_URL= environment.apiUrl;

  constructor(private httpClient:HttpClient) {
  }

  getMessages(){
    return this.httpClient.get(this.API_URL+"messages");
  }
}
