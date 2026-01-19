
import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-language-picker',
  imports: [Popover],
  templateUrl: './language-picker.html',
  styleUrl: './language-picker.css',
})
export class LanguagePicker implements OnInit {
  private translate = inject(TranslateService);
  private readonly LANG_KEY = 'preferredLang';

  isOpen = signal(false);
  currentLang = signal(this.translate.getCurrentLang() || 'pl');

  languages = [
    { code: 'pl', label: 'Polski' },
    { code: 'en', label: 'English' },
  ];

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((lang) => {
      this.currentLang.set(lang.lang);
    });
  }

  toggleDropdown() {
    this.isOpen.update((v) => !v);
  }

  selectLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.set(lang);

    localStorage.setItem(this.LANG_KEY, lang);
    this.isOpen.set(false);
  }
}
