import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInput } from "./form-input/form-input";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, FormInput, RouterLink],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
})
export class AuthForm {
  private fb = inject(FormBuilder);

  authForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],

  });

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }
    console.log(this.authForm.value);
  }
}
