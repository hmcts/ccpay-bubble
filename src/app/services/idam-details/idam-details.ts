import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { PaybubbleHttpClient } from '../httpclient/paybubble.http.client';

@Injectable()
export class IdamDetails {

    loggedInUserRolesBehavioralSubject$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    constructor(
        private http: PaybubbleHttpClient,
    ) { }

    getUserDetails(): Observable<any> {
        this.http.get('/api/user-roles').subscribe(res => {
            this.loggedInUserRolesBehavioralSubject$.next(JSON.parse(res));
        });
        return this.loggedInUserRolesBehavioralSubject$.asObservable();
    }
}
