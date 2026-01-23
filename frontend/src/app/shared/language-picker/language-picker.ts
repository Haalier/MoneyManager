import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-language-picker',
  imports: [MenuModule, NgClass],
  templateUrl: './language-picker.html',
  styleUrl: './language-picker.css',
})
export class LanguagePicker implements OnInit {
  private readonly LANG_KEY = 'preferredLang';
  private translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  currentLang = signal(this.translate.getCurrentLang() || 'pl');

  languages = [
    { code: 'pl', label: 'Polski' },
    { code: 'en', label: 'English' },
  ];

  menuItems = computed<MenuItem[]>(() => [
    {
      label: 'Polski',
      code: 'pl',
      command: () => this.selectLanguage('pl'),
      styleClass: this.currentLang() === 'pl' ? 'bg-blue-50 text-blue-600' : '',
    },
    {
      label: 'English',
      code: 'en',
      command: () => this.selectLanguage('en'),
      styleClass: this.currentLang() === 'en' ? 'bg-blue-50 text-blue-600' : '',
    },
  ]);

  ngOnInit(): void {
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lang) => {
      this.currentLang.set(lang.lang);
    });
  }

  selectLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.set(lang);

    localStorage.setItem(this.LANG_KEY, lang);
  }
}
