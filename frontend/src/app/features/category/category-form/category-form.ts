import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInput } from '../../../shared/form-input/form-input';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { Popover } from 'primeng/popover';
import { toSignal } from '@angular/core/rxjs-interop';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-category-form',
  imports: [FormInput, ReactiveFormsModule, PickerComponent, EmojiComponent, NgIcon, Popover],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
  viewProviders: [provideIcons({ lucidePlus })],
})
export class CategoryForm {
  @ViewChild('op') emojiPopover!: Popover;
  private fb = inject(FormBuilder);
  private toast = inject(HotToastService);
  protected categoryTypeOptions = [
    {
      value: 'income',
      label: 'Income',
    },
    {
      value: 'expense',
      label: 'Expense',
    },
  ];

  protected categoryForm = this.fb.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    icon: ['dollar'],
  });

  protected selectedIcon = toSignal(this.categoryForm.get('icon')!.valueChanges, {
    initialValue: 'dollar',
  });

  protected onSubmit() {
    console.log(this.categoryForm);
    this.toast.success('Category successfully added!');
  }

  protected addEmoji(event: any) {
    const shortName = event.emoji.shortName;
    this.categoryForm.get('icon')?.setValue(shortName);
    this.emojiPopover.hide();
  }
}
