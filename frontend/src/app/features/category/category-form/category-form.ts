import { Component, inject, Input, output, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInput } from '../../../shared/form-input/form-input';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { Popover } from 'primeng/popover';
import { toSignal } from '@angular/core/rxjs-interop';
import { HotToastService } from '@ngxpert/hot-toast';
import { Tooltip } from 'primeng/tooltip';
import { CategoryService } from '../category-service';
import { finalize, map, startWith } from 'rxjs';
import { Button } from 'primeng/button';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-category-form',
  imports: [
    FormInput,
    ReactiveFormsModule,
    PickerComponent,
    EmojiComponent,
    NgIcon,
    Popover,
    Tooltip,
    Button,
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
  viewProviders: [provideIcons({ lucidePlus })],
})
export class CategoryForm {
  @ViewChild('op') emojiPopover!: Popover;
  @Input() set category(data: Category | null) {
    if (data) {
      this.isEditMode = true;
      this.categoryForm.patchValue(data);
      this.categoryData = data;
    } else {
      this.isEditMode = false;
      this.categoryForm.reset();
    }
  }

  private categoryData: Category | null = null;

  protected isEditMode = false;
  private categoryService = inject(CategoryService);
  formSubmittedEvent = output();
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
    name: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
    type: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
    icon: this.fb.control('dollar', { nonNullable: true }),
  });

  protected selectedIcon = toSignal(this.categoryForm.get('icon')!.valueChanges, {
    initialValue: 'dollar',
  });
  protected isLoading: boolean = false;

  protected isDirty = toSignal(
    this.categoryForm.valueChanges.pipe(
      map(() => {
        if (!this.isEditMode || !this.categoryData) return false;
        const raw = this.categoryForm.getRawValue();
        return (
          raw.name !== this.categoryData.name ||
          raw.type !== this.categoryData.type ||
          raw.icon !== this.categoryData.icon
        );
      }),
      startWith(false),
    ),
    { initialValue: false },
  );

  protected onSubmit() {
    if (this.categoryForm.invalid) return;
    this.isLoading = true;
    const formData = this.categoryForm.getRawValue();

    const request$ =
      this.isEditMode && this.categoryData?.id
        ? this.categoryService.updateCategory(this.categoryData.id, formData)
        : this.categoryService.addCategory(formData);

    request$
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.formSubmittedEvent.emit();
          this.categoryForm.reset();
        }),
      )
      .subscribe({
        next: () => {
          const msg = this.isEditMode
            ? 'Category successfully updated!'
            : 'Category successfully added!';
          this.toast.success(msg);
        },
        error: (err) => {
          this.toast.error(err.message);
        },
      });
  }

  protected addEmoji(event: any) {
    const shortName = event.emoji.shortName;
    this.categoryForm.get('icon')?.setValue(shortName);
    this.emojiPopover.hide();
  }
}
