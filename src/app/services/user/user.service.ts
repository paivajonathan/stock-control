import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { SignupUserRequest } from 'src/app/models/interfaces/user/signup/request/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/signup/response/SignupUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/request/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/response/AuthResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
  ) { }

  signUpUser(requestData: SignupUserRequest): Observable<SignupUserResponse> {
    return this.httpClient.post<SignupUserResponse>(
      `${this.API_URL}/user`,
      requestData,
    );
  }

  authUser(requestData: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
      `${this.API_URL}/auth`,
      requestData,
    );
  }

  isLoggedIn(): boolean {
    const JWT_TOKEN = this.cookieService.get('USER_INFO');
    return JWT_TOKEN ? true : false;
  }
}
