import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, finalize, map, Observable, throwError} from "rxjs";
import {LoadingService} from "../services/loading.service";
import {SocketService} from "../services/socket.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn:'root'
})
export class HttpRequestInterceptor implements HttpInterceptor{

  constructor(private _loadingService:LoadingService,
              private _socketService:SocketService,
              private router:Router) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._loadingService.setLoading(true);
    if(!req.url.includes("login")){
      req = req.clone({
        setHeaders:{
          "Authorization": String(localStorage.getItem('token'))
        }
      });
    }
    return next.handle(req)
      .pipe(
        map((event:HttpEvent<any>)=>{
          console.log(event);
          return event;
        }),
        catchError((err) => {
          this.handleError(err);
          return throwError(()=> err);
        }),
        finalize(()=>this._loadingService.setLoading(false))
      );
  }


  handleError(err:HttpErrorResponse){
    if(err){
      switch(err.status){
        case 400:
              this._loadingService.
                setAlertData({'msg':err.error.msg,'type':'danger'})
              break;
        case 401:
          this._socketService
            .publishMessageToChannel("/app/user.disconnect")
            this._socketService.subscribeForUserDisconnected()
              .subscribe(isDisconnected=>{
                if(isDisconnected){
                  localStorage.clear();
                  this.router.navigate(['']);
                  if(err.error && err.error === 'Session Expired'){
                    this._loadingService
                      .setAlertData({'msg':err.error,'type':'danger'})
                  }else{
                    this._loadingService
                      .setAlertData({'msg':"Unauthorized Credentials",'type':'danger'})
                  }
                }
              })
            break;
      }
    }
  }



}
