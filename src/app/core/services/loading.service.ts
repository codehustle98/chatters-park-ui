import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class LoadingService{

  private isLoading=new Subject<boolean>();
  private showAlert=new Subject<any>();

  public setLoading(isLoading:boolean){
    this.isLoading.next(isLoading);
  }

  public subscribeForLoader(){
    return this.isLoading.asObservable();
  }

  public setAlertData(data:any){
    this.showAlert.next(data);
  }

  public subscribeForAlertData(){
    return this.showAlert.asObservable();
  }
}
