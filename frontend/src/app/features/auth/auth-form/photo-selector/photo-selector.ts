import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, ElementRef, forwardRef, OnDestroy, signal, ViewChild } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideTrash2, lucideUpload, lucideUser } from '@ng-icons/lucide';
import { Tooltip } from "primeng/tooltip";

@Component({
  selector: 'app-photo-selector',
  imports: [NgIcon, Tooltip],
  templateUrl: './photo-selector.html',
  styleUrl: './photo-selector.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PhotoSelector)
    }
  ],
  viewProviders: [provideIcons({ lucideUser, lucideUpload, lucideTrash2 })]
})
export class PhotoSelector implements ControlValueAccessor, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  isProcessing = signal<boolean>(false);
  previewUrl = signal<string | null>(null);
  image = signal<File | null>(null)

  onChange: (value: string | null) => void = () => { };
  onTouched: () => void = () => { };


  writeValue(value: string | null): void {
    if (!value) this.cleanUpObjectURL();
    this.previewUrl.set(value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.isProcessing.set(true);
      this.cleanUpObjectURL();

      this.image.set(file);
      
      const preview = URL.createObjectURL(file);
      this.previewUrl.set(preview);

      if (file.size > 3 * 1024 * 1024) {
        this.compressImage(file);
      } else {
        this.readFileAsBase64(file);

      }
    }
  }

  protected triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  protected removePhoto(): void {
    this.cleanUpObjectURL();
    this.image.set(null);
    this.previewUrl.set(null);
    this.onChange(null);

    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private cleanUpObjectURL(): void {
    const currentUrl = this.previewUrl();
    if (currentUrl && currentUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentUrl);
    }
  }

  private readFileAsBase64(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.onChange(reader.result as string);
      this.isProcessing.set(false);
    };
    reader.readAsDataURL(file);
  }

  private compressImage(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        this.onChange(compressedBase64);
        this.isProcessing.set(false);
      }
    }
  }

  ngOnDestroy(): void {
    this.cleanUpObjectURL();
  }
}
