import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoadingSignal = signal(false);

  public isLoading = this.isLoadingSignal.asReadonly();

  public setLoading(state: boolean) {
    this.isLoadingSignal.set(state);
  }
}
