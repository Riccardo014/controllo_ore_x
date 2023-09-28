import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RtLoadingService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoadingBlocking$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  showLoadingBlocking(): void {
    this.isLoadingBlocking$.next(true);
  }

  hideLoadingBlocking(): void {
    if (this.isLoadingBlocking$.value) {
      this.isLoadingBlocking$.next(false);
    }
  }

  showLoading(): void {
    this.isLoading$.next(true);
  }

  hideLoading(): void {
    if (this.isLoading$.value) {
      this.isLoading$.next(false);
    }
  }
}
