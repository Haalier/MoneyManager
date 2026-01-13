import { NgIcon, provideIcons } from '@ng-icons/core';
import { Component, forwardRef, Input, Optional, Self } from '@angular/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { TooltipModule } from 'primeng/tooltip';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-form-input',
  imports: [NgIcon, TooltipModule, NgClass],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css',
  viewProviders: [provideIcons({ lucideEye, lucideEyeOff })],
})
export class FormInput implements ControlValueAccessor {
  @Input({ required: true }) label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input({ required: true }) id: string = '';
  @Input() isSelect: boolean = false;
  @Input() options: { value: string; label: string }[] = [];

  value: string = '';
  isDisabled: boolean = false;

  showPassword: boolean = false;

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
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
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  get errorMessage(): string | null {
    const control = this.ngControl?.control;

    if (!control || !control.touched || !control.errors) {
      return null;
    }

    const errors = control.errors;

    if (errors['required']) return `${this.label} is required.`;
    if (errors['email']) return `Please enter a valid email address.`;
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${this.label} must be at least ${requiredLength} characters long.`;
    }
    if (errors['pattern']) return `Invalid format.`;

    return 'Invalid value.';
  }
}
