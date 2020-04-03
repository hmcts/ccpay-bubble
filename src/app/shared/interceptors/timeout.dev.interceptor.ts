import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {timeout} from 'rxjs/operators';

const defaultTimeOut = 120000;

@Injectable()
export class TimeoutDevInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeouts = Number(req.headers.get('timeout')) || defaultTimeOut;
   req.headers.delete('timeout');
    return next.handle(req).pipe(timeout(timeouts));
  }

}
