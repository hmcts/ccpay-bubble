import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { Observable, of } from 'rxjs';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { HttpHeaders } from '@angular/common/http';

describe('Paybubble client', () => {
  let httpClient: PaybubbleHttpClient;
  let meta: Meta;
  let http: HttpClient;
  const options: any = {};
  const mockPost = (url, body, opts) => of(opts);

  beforeEach(() => {
    meta = instance(mock(Meta));
    http = instance(mock(HttpClient));
    httpClient = new PaybubbleHttpClient(http, meta);
    spyOn(http, 'post').and.callFake(mockPost);
  });

  it('Should add headers to an object', () => {
    httpClient.addHeaders(options);
    expect(options['headers']).toBeTruthy();
  });

  it('Should add headers with correct properties to an object', () => {
    httpClient.addHeaders(options);
    expect(options['responseType']).toBe('text');
    expect(options['headers'].get('X-Requested-With')).toBe('XMLHttpRequest');
  });

  it('Should retain headers that have been set previously', () => {
    options.headers = new HttpHeaders({'Content-Type': 'application/json'});
    httpClient.addHeaders(options);
    expect(options.headers.get('Content-Type')).toBe('application/json');
  });

  it('Should add headers to a post request', () => {
    httpClient.post('www.mock.com', { 'test-prop': 'value'}, {}).subscribe(response => {
      expect(response['headers'].get('X-Requested-With')).toBe('XMLHttpRequest');
    });
  });
});
