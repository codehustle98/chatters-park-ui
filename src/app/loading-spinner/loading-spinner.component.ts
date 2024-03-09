import { Component, OnInit } from '@angular/core';
import {LoadingService} from "../core/services/loading.service";

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {

  isLoading:boolean=false;
  constructor(private loadingService:LoadingService) {
    this.loadingService
      .subscribeForLoader()
      .subscribe(status => this.isLoading = status);
  }

  ngOnInit(): void {
  }

}
