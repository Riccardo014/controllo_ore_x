import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReleaseCreateDto,
  ReleaseReadDto,
  ReleaseUpdateDto,
} from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { UpsertPage } from '@app/_shared/classes/upsert-page.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';
import { Subscription } from 'rxjs';
import { ReleaseFormHelper } from '../../helpers/release.form-helper';

@Component({
  selector: 'controllo-ore-x-release-upsert',
  templateUrl: './release-upsert.page.html',
  styleUrls: ['./release-upsert.page.scss'],
  providers: [ReleaseFormHelper],
})
export class ReleaseUpsertPage
  extends UpsertPage<ReleaseReadDto, ReleaseCreateDto, ReleaseUpdateDto>
  implements SubscriptionsLifecycle, OnDestroy, OnInit
{
  override title: string = 'Crea nuova release';

  releaseId?: string;

  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    public override formHelper: ReleaseFormHelper,
    private _releaseDataService: ReleaseDataService,
    private _alertService: AlertService,
    private _rtDialogService: RtDialogService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    super(
      formHelper,
      _alertService,
      _rtDialogService,
      _router,
      _activatedRoute,
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this._setSubscriptions();

    if (!this.isCreating) {
      this.title = 'Modifica release';
    }
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    if (!this.isCreating) {
      this.releaseId = this.formHelper.entityId;
      this.subscriptionsList.push(this._getRelease());
    }
  }

  override handleUserSubmission(): void {
    this.formHelper.form.patchValue({
      project: this.getProjectId(),
    });

    super.handleUserSubmission();
  }

  /**
   * Return the project's id.
   */
  getProjectId(): string {
    return this._activatedRoute.snapshot.params['projectId'];
  }

  /**
   * Get the release's data from the database.
   */
  private _getRelease(): Subscription {
    if (!this.releaseId) {
      throw new Error('Non è stato possibile recuperare i dati della release.');
    }
    return this._releaseDataService
      .getOne(this.releaseId)
      .subscribe((release: any) => {
        this.formHelper.patchForm({
          ...release,
          project: release.projectId,
        });
      });
  }
}
