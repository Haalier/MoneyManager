import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguagePicker } from '../../../shared/language-picker/language-picker';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { Popover } from 'primeng/popover';
import { NgTemplateOutlet } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, LanguagePicker, NgIcon, TranslatePipe, Popover, NgTemplateOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
  viewProviders: [provideIcons({ lucideInfo })],
})
export class AuthLayout {
  private breakpointObserver = inject(BreakpointObserver);

  isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  toggleTestAccount(event: Event, popover: any) {
    if (this.isMobile()) {
      popover.toggle(event);
    }
  }
}
