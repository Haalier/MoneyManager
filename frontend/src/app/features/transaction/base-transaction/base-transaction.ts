import { Directive, inject, Signal, signal, ViewChild } from '@angular/core';
import { TransactionForm } from '../transaction-form/transaction-form';
import { CategoryService } from '../../category/category-service';
import { LoadingService } from '../../../core/services/loading-service';
import { TranslateService } from '@ngx-translate/core';
import { TransactionType } from '../../../shared/enums/transactions.enum';
import { finalize, Observable } from 'rxjs';
import { Category } from '../../../shared/models/category.model';
import { MessageService } from 'primeng/api';

@Directive()
export abstract class BaseTransactionComponent<T> {
  @ViewChild('transactionForm') transactionFormRef!: TransactionForm;

  protected categoryService = inject(CategoryService);
  protected loadingService = inject(LoadingService);
  private messageService = inject(MessageService);
  protected translate = inject(TranslateService);

  isLoading = this.loadingService.isLoading;
  addDialogVisible = signal<boolean>(false);
  downloadLoader = signal<boolean>(false);
  emailLoader = signal<boolean>(false);

  protected abstract TYPE: TransactionType;
  protected abstract filename: string;

  protected abstract transactions: any;
  protected abstract categories: Signal<Category[]>;

  protected abstract addAction(data: T): Observable<any>;
  protected abstract deleteAction(id: number): Observable<any>;
  protected abstract downloadAction(): Observable<Blob>;
  protected abstract emailAction(): Observable<any>;

  protected onDialogToggle(): void {
    this.addDialogVisible.set(true);
  }

  onSubmitForm(event: T) {
    this.addAction(event).subscribe({
      next: () => {
        this.addDialogVisible.set(false);
        this.transactionFormRef.resetForm();
      },
    });
  }

  onDelete(event: number) {
    this.deleteAction(event).subscribe();
  }

  onExcelDownload(): void {
    this.downloadLoader.set(true);
    this.downloadAction()
      .pipe(finalize(() => this.downloadLoader.set(false)))
      .subscribe({
        next: (res) => {
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', this.filename);
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant(`${this.TYPE}.download.success`),
            detail: '',
          });
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant(`${this.TYPE}.download.error`),
            detail: '',
          }),
      });
  }

  onEmailSend() {
    this.emailLoader.set(true);
    this.emailAction()
      .pipe(finalize(() => this.emailLoader.set(false)))
      .subscribe({
        next: () => this.messageService.add({
          severity: 'success',
          summary: this.translate.instant(`${this.TYPE}.email.success`),
          detail: '',
        }),
        error: () => this.messageService.add({
          severity: 'error',
          summary: this.translate.instant(`${this.TYPE}.email.error`),
          detail: '',
        }),
      });
  }
}
