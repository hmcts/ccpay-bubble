import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable()
export class PaybubbleHttpClient {
  constructor(
    private http: HttpClient,
    private meta: Meta
  ) { }

  post(url: string, body: any | null, options?: any): Observable<any> {
    const opts = this.addHeaders(options || {});
    return this.http.post(url, body, opts);
  }

  get(url: string) {
    return this.http.get(url);
  }

  addHeaders(options: any): any {
    const csrfToken = this.meta.getTag('name=csrf-token');
    const headers = {};
    if (options.headers) {
      options.headers.forEach(element => {
        headers[element] = options.headers.get(element);
      });
    }
    headers['X-Requested-With'] = 'XMLHttpRequest';
    headers['CSRF-Token'] = csrfToken.content;
    options.headers = new HttpHeaders(headers);
    options.responseType = 'text';
    return options;
  }
}
