import { Component, computed, effect, inject, input, output, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInput } from '../../../shared/form-input/form-input';
import { Popover } from 'primeng/popover';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tooltip } from 'primeng/tooltip';
import { Button } from 'primeng/button';
import { Category } from '../../../models/category.model';
import { LoadingService } from '../../../shared/services/loading-service';
import { FormSelect } from '../../../shared/form-select/form-select';
import { CategoryDTO } from '../../../models/DTO/category.dto';
import { EmojiPicker } from '../../../shared/emoji-picker/emoji-picker';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-category-form',
  imports: [
    FormInput,
    ReactiveFormsModule,
    Tooltip,
    Button,
    FormSelect,
    EmojiPicker,
    TranslatePipe,
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  @ViewChild('op') emojiPopover!: Popover;

  category = input<Category | null>(null);
  submitForm = output<CategoryDTO>();

  protected isEditMode = computed(() => !!this.category());

  private fb = inject(FormBuilder);
  private loadingService = inject(LoadingService);

  protected categoryTypeOptions = [
    {
      value: 'income',
      label: 'general.income',
    },
    {
      value: 'expense',
      label: 'general.expense',
    },
  ];

  protected categoryForm = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
    type: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
    icon: this.fb.control('dollar', { nonNullable: true }),
  });

  protected isLoading = this.loadingService.isLoading;

  private formValueSignal = toSignal(this.categoryForm.valueChanges, {
    initialValue: this.categoryForm.getRawValue(),
  });

  protected isDirty = computed(() => {
    const initialData = this.category();
    if (!initialData) return false;

    const currentForm = this.formValueSignal();

    return (
      currentForm.name !== initialData.name ||
      currentForm.type !== initialData.type ||
      currentForm.icon !== initialData.icon
    );
  });

  constructor() {
    effect(() => {
      const data = this.category();
      if (data) {
        this.categoryForm.patchValue(data);
      } else {
        this.categoryForm.reset({ icon: 'dollar' });
      }
    });
  }

  protected onSubmitForm() {
    if (this.categoryForm.invalid) return;
    const formData = this.categoryForm.getRawValue() as CategoryDTO;
    this.submitForm.emit(formData);
  }

  protected addEmoji(event: any) {
    const shortName = event.emoji.shortName;
    this.categoryForm.get('icon')?.setValue(shortName);
    this.emojiPopover.hide();
  }

  resetForm() {
    this.categoryForm.reset();
  }
}
