import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  INDEX_CONFIGURATION_KEY,
  UserCreateDto,
  UserReadDto,
  UserUpdateDto,
} from '@api-interfaces';
import { UserDataService } from '@app/_core/services/user-data.service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { IndexConfigurationDataService } from '@core/services/index-configuration-data.service';
import { BehaviorSubject, ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-team-index',
  templateUrl: './team-index.page.html',
  styleUrls: ['./team-index.page.scss'],
})
export class TeamIndexPage
  extends IndexPage<UserReadDto, UserCreateDto, UserUpdateDto>
  implements OnInit, OnDestroy
{
  override title: string = 'Team';
  pageTitle = 'Team';
  buttonIcon = 'bakery_dining';
  buttonText = 'Nuovo Membro';

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.TEAM;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;

  destroy$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: UserDataService,
  ) {
    super();

    this.isLoading.pipe(takeUntil(this.destroy$)).subscribe((r) => {
      this.isItLoading = false;
    });
    this.isFirstLoadDone.pipe(takeUntil(this.destroy$)).subscribe((r) => {
      this._isFirstLoadDone = new BehaviorSubject<boolean>(false);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  openUpsertDialog(user?: UserReadDto): void {
    console.log('openUpsertDialog', user);
  }

  openConfirmationDelete(user: UserReadDto): void {
    console.log('openConfirmationDelete', user);
  }
}
