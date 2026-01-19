import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);
  private readonly LANG_KEY = 'preferredLang';

  public initLanguage(): void {
    const saved = localStorage.getItem(this.LANG_KEY) || 'pl';
    this.translate.use(saved);
  }
}
