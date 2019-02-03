import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { httpFactory } from '@angular/http/src/http_module';

@Injectable()
export class PaybubbleHttpClient {
    constructor(private http: HttpClient, private meta: Meta) { }

    post(url: string, body: any | null, options?: any): Observable<any> {
        const opts = this.addHeaders(options || {});
        console.log('http: ' + this.http);
        return this.http.post(url, body, opts);
    }

    addHeaders(options: any): any {
        const headers = {};
        if (options.headers) {
          options.headers.forEach(element => {
            headers[element] = options.headers.get(element);
          });
        }
        headers['X-Requested-With'] = 'XMLHttpRequest';
        options.headers = new HttpHeaders(headers);
        return options;
      }
}
