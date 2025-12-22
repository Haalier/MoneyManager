import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

interface LoginRes {

}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private URL = "https://moneymanager-1-vrgj.onrender.com/api/v1.0";

  private http = inject(HttpClient);

  private _user = signal({});
  public user = this._user.asReadonly();


  public login(email: string, password: string) {
    this.http.post(`${this.URL}/login`, {email, password});
  }

}
