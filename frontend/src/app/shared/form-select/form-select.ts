import { Component, input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-select',
  imports: [NgClass],
  templateUrl: './form-select.html',
  styleUrl: './form-select.css',
})
export class FormSelect<T> implements ControlValueAccessor {
  label = input.required<string>();
  id = input.required<string>();
  placeholder = input<string>();
  options = input.required<T[]>();
  bindLabel = input<keyof T | string>('label');
  bindValue = input<keyof T | string>('value');

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  getOptionLabel(option: T): string {
    const key = this.bindLabel() as keyof T;
    return String(option[key]) || '';
  }

  getOptionValue(option: T): any {
    const key = this.bindValue() as keyof T;
    return option[key];
  }

  value: any;
  isDisabled: boolean = false;

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
    const val = (event.target as HTMLSelectElement).value;
    this.value = val;
    this.onChange(val);
  }

  get errorMessage(): string | null {
    const control = this.ngControl?.control;

    if (!control || !control.touched || !control.errors) {
      return null;
    }

    const errors = control.errors;

    if (errors['required']) return `${this.label()} is required.`;
    if (errors['email']) return `Please enter a valid email address.`;
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${this.label()} must be at least ${requiredLength} characters long.`;
    }
    if (errors['pattern']) return `Invalid format.`;

    return 'Invalid value.';
  }
}
