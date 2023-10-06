import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AuthResponeData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponeData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAzvdi68fXYh1FJ4DS2hhbB_4d0ll1Hypg',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        },
      )
      .pipe(catchError(this.handleAuthError));
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthResponeData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAzvdi68fXYh1FJ4DS2hhbB_4d0ll1Hypg',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        },
      )
      .pipe(catchError(this.handleAuthError));
  }

  private handleAuthError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'Неизвестная ошибка';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(() => errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Пользователь уже зарегестрирован';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Пользователь не найден';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Неверная пара логин/пароль';
        break;
    }
    return throwError(() => errorMessage);
  }
}
