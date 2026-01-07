import { NgIcon, provideIcons } from '@ng-icons/core';
import { Component, forwardRef, Input } from '@angular/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { TooltipModule } from 'primeng/tooltip';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  imports: [NgIcon, TooltipModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css',
  viewProviders: [provideIcons({ lucideEye, lucideEyeOff })],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true
    }
  ]
})
export class FormInput implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() id: string = '';

  value: string = '';
  isDisabled: boolean = false;

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onChange = (value: string) => { };
  onTouched = () => { };

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
}
