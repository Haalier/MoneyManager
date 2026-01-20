import { Component, forwardRef, output, ViewChild } from '@angular/core';
import { Popover } from 'primeng/popover';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-emoji-picker',
  imports: [Popover, NgIcon, PickerComponent, EmojiComponent, TranslatePipe],
  templateUrl: './emoji-picker.html',
  styleUrl: './emoji-picker.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmojiPicker),
      multi: true,
    },
  ],
  viewProviders: [provideIcons({})],
})
export class EmojiPicker implements ControlValueAccessor {
  @ViewChild('op') emojiPopover!: Popover;

  value: string = 'dollar';
  disabled: boolean = false;

  onTouched: () => void = () => {};
  onChange: (val: string) => void = () => {};

  writeValue(obj: any): void {
    if (this.value) {
      this.value = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onAddEmoji(event: any) {
    const shortName = event.emoji.shortName;
    this.value = shortName;
    this.onChange(shortName);
    this.onTouched();
    this.emojiPopover.hide();
  }
}
