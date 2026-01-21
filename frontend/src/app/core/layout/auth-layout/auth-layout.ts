import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguagePicker } from '../../../shared/language-picker/language-picker';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, LanguagePicker],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {

}
