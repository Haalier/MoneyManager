import { NgIcon, provideIcons } from '@ng-icons/core';
import { Component, Input, Optional, Self } from '@angular/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { TooltipModule } from 'primeng/tooltip';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-input',
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
    let val: any = target.value;

    if (this.type === 'number') {
      val = target.value.replace(/[^0-9]/g, '');
      target.value = val;

      const numericValue = parseFloat(val);

      if (val === '') {
        this.value = val;
        this.onChange(null);
      } else if (!isNaN(numericValue)) {
        this.value = val;
        this.onChange(numericValue);
      } else {
        return;
      }
    } else {
      this.value = target.value;
      this.onChange(val);
    }
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
