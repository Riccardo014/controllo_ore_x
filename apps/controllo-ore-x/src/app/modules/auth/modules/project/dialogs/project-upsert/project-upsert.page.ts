import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiPaginatedResponse,
  CustomerReadDto,
  ProjectCreateDto,
  ProjectReadDto,
  ProjectUpdateDto,
} from '@api-interfaces';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import { UpsertPage } from '@app/_shared/classes/upsert-page.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';
import { Subscription } from 'rxjs';
import { ProjectFormHelper } from '../../helpers/project.form-helper';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'controllo-ore-x-project-upsert',
  templateUrl: './project-upsert.page.html',
  styleUrls: ['./project-upsert.page.scss'],
  providers: [ProjectFormHelper],
})
export class ProjectUpsertPage
  extends UpsertPage<ProjectReadDto, ProjectCreateDto, ProjectUpdateDto>
  implements SubscriptionsLifecycle, OnDestroy, OnInit
{
  override title: string = 'Crea nuovo progetto';

  isPasswordVisible: boolean = false;
  projectId?: string | number;
  currentCustomer?: string;
  // defaultColor: string = '#E54927';
  // colors: string[] = ['#E54927', '#D3C1FC', '#C9D8F9', '#FFF2DF', '#D5F4EA', '#ECCAC2'];
  
  user = { color: '#234532' };
  selectedColor: ThemePalette = 'primary';
  
  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  customers: CustomerReadDto[] = [];
  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    public override formHelper: ProjectFormHelper,
    private _projectDataService: ProjectDataService,
    private _alertService: AlertService,
    private _rtDialogService: RtDialogService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _customerDataService: CustomerDataService,
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
      this.title = 'Modifica progetto';
    }
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(this._getProjectsCustomers());
    if (!this.isCreating) {
      this.projectId = this.formHelper.entityId;
      this.subscriptionsList.push(this._getProject());
    }
  }

  override handleUserSubmission(): void {
    this.formHelper.form.patchValue({
      customer: this.customers.find(
        (customer: CustomerReadDto) => customer.name === this.formHelper.form.value.customer,
      ),
    });
    this.formHelper.form.patchValue({
      color: this.formHelper.form.value.color.hex,
    });

    super.handleUserSubmission();
  }

  /**
   * Get the project's data from the database.
   */
  private _getProject(): Subscription {
    if (!this.projectId) {
      throw new Error('Non è stato possibile recuperare i dati del progetto.');
    }
    return this._projectDataService
      .getOne(this.projectId)
      .subscribe((project: any) => {
        this.formHelper.patchForm(project);
      });
  }

  /**
   * Fetch and set the project' customers from the database.
   */
  private _getProjectsCustomers(): Subscription {
    return this._customerDataService
      .getMany({})
      .subscribe((customers: ApiPaginatedResponse<CustomerReadDto>) => {
        this.customers = customers.data;
      });
  }

}
