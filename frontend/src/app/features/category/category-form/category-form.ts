import {
  Component,
  computed,
  effect,
  inject,
  input,
  Input,
  output,
  ViewChild,
} from '@angular/core';
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
import { LoadingService } from '../../../shared/services/loading-service';
import { FormSelect } from '../../../shared/form-select/form-select';
import { CategoryDTO } from '../../../models/DTO/category.dto';

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
    FormSelect,
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
  viewProviders: [provideIcons({ lucidePlus })],
})
export class CategoryForm {
  @ViewChild('op') emojiPopover!: Popover;

  category = input<Category | null>(null);
  submitForm = output<{ isEditMode: boolean; newCategory: CategoryDTO }>();
  protected isEditMode = computed(() => !!this.category());

  private fb = inject(FormBuilder);
  private loadingService = inject(LoadingService);

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
    this.submitForm.emit({ isEditMode: this.isEditMode(), newCategory: formData });
  }

  protected addEmoji(event: any) {
    const shortName = event.emoji.shortName;
    this.categoryForm.get('icon')?.setValue(shortName);
    this.emojiPopover.hide();
  }
}
