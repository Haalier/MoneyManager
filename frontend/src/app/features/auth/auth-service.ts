import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../../models/user.model';
import { catchError, EMPTY, finalize, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

interface LoginRes {
  token: string,
  user: User
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly URL = "https://moneymanager-1-vrgj.onrender.com/api/v1.0";
  private readonly CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dizakv3kv/image/upload";
  private readonly CLOUDINARY_UPLOAD_PRESET = "moneymanager";
  private readonly http = inject(HttpClient);

  private _user = signal<User | null>(null);
  private _isLoading = signal<boolean>(false);


  public readonly user = this._user.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();

  public isLoggedIn = computed(() => !!this._user());


  public checkAuth(): Observable<boolean> {
    this._isLoading.set(true);

    return this.http.get<User>(`${this.URL}/me`, { withCredentials: true })
      .pipe(
        map((user) => {
          this._user.set(user);
          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          this._user.set(null);
          return of(false);
        }), finalize(() => {
          this._isLoading.set(false);
        })
      );
  }

  private uploadProfileImage(image: string): Observable<any> {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", this.CLOUDINARY_UPLOAD_PRESET);
    return this.http.post(this.CLOUDINARY_URL, formData).pipe(
      map((res: any) => res.secure_url),
      catchError(error => {
        return throwError(() => `Cloudinary upload failed: ${error?.message || error}`);
      }));
  }

  public signup(fullName: string, email: string, password: string, profileImage: string) {

    const signupRequest = (imageUrl?: string) => {
      return this.http.post<LoginRes>(`${this.URL}/register`, { fullName, email, password, profileImage: imageUrl || profileImage }, {
        withCredentials: true
      }).pipe(tap(res => {
        this._user.set(res.user)
        this.router.navigate(['/dashboard']);
      }), catchError(error => {
        console.error("Signup failed: ", error)
        return throwError(() => error);
      }));
    }

    if (profileImage) {
      return this.uploadProfileImage(profileImage).pipe(
        switchMap((imageUrl: string) => signupRequest(imageUrl)
        ));
    }

    return signupRequest();

  }


  public login(email: string, password: string) {
    return this.http.post<LoginRes>(`${this.URL}/login`, { email, password }, {
      withCredentials: true
    }).pipe(tap(res => {
      this._user.set(res.user)
      this.router.navigate(['/dashboard']);
    }), catchError(error => {
      console.error("Login failed: ", error)
      return throwError(() => error);
    }));
  }

  public logout() {
    return this.http.post(`${this.URL}/logout`, {}).pipe(
      tap(_ => {
        this._user.set(null);
        this.router.navigate(['/login']);
      }),
      catchError(err => {
        console.error('Logout failed: ', err);
        this._user.set(null);
        this.router.navigate(['/login']);
        return EMPTY;
      })
    )
  }

}
