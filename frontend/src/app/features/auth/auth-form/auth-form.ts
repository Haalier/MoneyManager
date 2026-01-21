import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInput } from '../../../shared/form-input/form-input';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service';
import { ErrorMessage } from '../../../shared/error-message/error-message';
import { first } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { PhotoSelector } from './photo-selector/photo-selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from '../../../core/services/loading-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-form',
  imports: [
    ReactiveFormsModule,
    FormInput,
    RouterLink,
    ErrorMessage,
    ButtonModule,
    PhotoSelector,
    TranslatePipe,
  ],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
})
export class AuthForm implements OnInit {
  private toast = inject(HotToastService);
  private act = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private loadingService = inject(LoadingService);
  private translate = inject(TranslateService);
  protected route = this.act.snapshot.url.map((segment) => segment.path).join('/');

  protected isLoading = this.loadingService.isLoading;

  protected errorMessage = signal<string>('');

  authForm = this.fb.group({
    fullName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    profileImage: [''],
  });

  ngOnInit(): void {
    if (this.route === 'signup') {
      this.authForm.get('fullName')?.setValidators([Validators.required, Validators.minLength(3)]);
    }
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    if (this.route === 'signup') {
      console.log('Submitting signup form with values: ', this.authForm.value);
      this.authService
        .signup(
          this.authForm.value.fullName!,
          this.authForm.value.email!,
          this.authForm.value.password!,
          this.authForm.value.profileImage!,
        )
        .pipe(first(), takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toast.show(this.translate.instant('auth.account-created'));
            this.errorMessage.set('');
          },
          error: (err) => {
            console.error('Signup error: ', err);
            this.errorMessage.set(err.error.message || 'An error occurred. Please try again.');
          },
        });
    } else {
      this.authService
        .login(this.authForm.value.email!, this.authForm.value.password!)
        .pipe(first(), takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toast.success(this.translate.instant('auth.logged-in'));
            this.errorMessage.set('');
          },
          error: (err) => {
            this.errorMessage.set(err.error.message || 'An error occurred. Please try again.');
          },
        });
    }
  }
}
