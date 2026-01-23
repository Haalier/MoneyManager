import { Component, input } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCoins, lucideWallet, lucideWalletCards } from '@ng-icons/lucide';

@Component({
  selector: 'app-info-card',
  imports: [CurrencyPipe, NgIcon, NgClass],
  templateUrl: './info-card.html',
  styleUrl: './info-card.css',
  viewProviders: [provideIcons({ lucideWalletCards, lucideWallet, lucideCoins })],
})
export class InfoCard {
  icon = input.required<string>();
  label = input.required<string>();
  value = input.required<number>();
  color = input<string>();
}
