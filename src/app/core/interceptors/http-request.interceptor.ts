import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn:'root'
})
export class HttpRequestInterceptor implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!req.url.includes("login")){
      req = req.clone({
        setHeaders:{
          "Authorization": String(localStorage.getItem('token'))
        }
      });
    }
    return next.handle(req);
  }



}
