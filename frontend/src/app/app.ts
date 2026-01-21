import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './core/services/language-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  constructor() {
    this.translate.addLangs(['pl', 'en']);
    this.translate.setFallbackLang('en');
    this.languageService.initLanguage();
  }
}
