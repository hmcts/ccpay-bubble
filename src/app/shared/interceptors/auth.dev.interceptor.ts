import { HttpInterceptorFn } from '@angular/common/http';

const email = 'krishnakn00@gmail.com';

export const authDevInterceptor: HttpInterceptorFn = (req, next) => {
  const dupReq = req.clone({ headers: req.headers.set('Auth-Dev', email) });
  return next(dupReq);
};
