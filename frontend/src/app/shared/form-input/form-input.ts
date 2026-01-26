import { NgIcon, provideIcons } from '@ng-icons/core';
import { Component, inject, Input, Optional, Self } from '@angular/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { TooltipModule } from 'primeng/tooltip';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService, _ } from '@ngx-translate/core';
import { parse } from 'date-fns';

@Component({
  selector: 'app-input',
  imports: [NgIcon, TooltipModule, NgClass, TranslatePipe],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css',
  viewProviders: [provideIcons({ lucideEye, lucideEyeOff })],
})
export class FormInput implements ControlValueAccessor {
  @Input({ required: true }) label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input({ required: true }) id: string = '';
  private translate = inject(TranslateService);

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  value: any;
  isDisabled: boolean = false;

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let rawValue = target.value;

    this.value = rawValue;
    this.onChange(this.value);
  }

  get errorMessage(): string | null {
    const control = this.ngControl?.control;

    if (!control || !control.touched || !control.errors) {
      return null;
    }

    const params = { field: this.label };

    const errors = control.errors;

    if (errors['required']) return this.translate.instant('errors.required', params);
    if (errors['email']) return this.translate.instant('error.email');
    if (errors['invalidNumber']) return this.translate.instant('errors.invalid-number');
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return this.translate.instant('errors.min-length', { ...params, length: requiredLength });
    }
    if (errors['pattern']) return this.translate.instant('errors.pattern');
    if (errors['futureDate']) return this.translate.instant('errors.future-date');

    return this.translate.instant('errors.default');
  }
}
