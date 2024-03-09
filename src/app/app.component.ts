import { Component } from '@angular/core';
import {LoadingService} from "./core/services/loading.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  alert:any;
  constructor(private _loadingService:LoadingService) {
    this._loadingService.
      subscribeForAlertData()
      .subscribe(data=>{
        this.alert = data;
      });
  }
}
