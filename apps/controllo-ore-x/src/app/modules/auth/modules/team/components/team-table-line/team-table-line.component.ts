import { Component, Input } from '@angular/core';
import { ROLE, RoleReadDto, UserReadDto } from '@api-interfaces';
import { RoleDataService } from '@app/_core/services/role-data.service';
import { SubscriptionsLifecycle } from '@cox-interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-team-table-line',
  templateUrl: './team-table-line.component.html',
  styleUrls: ['./team-table-line.component.scss'],
})
export class TeamTableLineComponent implements SubscriptionsLifecycle{
  
  avatarSrc: string = '';
  name: string = '';
  email: string = '';
  creationDate: string = '';
  role: string = '';

  roles: ROLE[] = [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.COLLABORATOR];

  _user: UserReadDto | undefined;
  _roleList: RoleReadDto[] | undefined;

  subscriptionsList: Subscription[] = [];

  constructor(private _roleDataService : RoleDataService) {}

  @Input() set user(data: UserReadDto | undefined) {
    if (!data) {
      return;
    }

    this._user = data;
    this._updateView();
  }

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions();
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._roleDataService.getMany().subscribe(
        data => {
          this._roleList = data.data;
          this._updateView();
        }
      ),
    );
  }

  _completeSubscriptions(): void {
    for (const subscription of this.subscriptionsList) {
        subscription.unsubscribe();
    }
  }

  private _updateView(): void {
    if (!this._user) {
      return;
    }

    this.name = this._user.name + ' ' + this._user.surname;
    this.email = this._user.email;
    this.creationDate = new Date(this._user.createdAt.toString()).getDate() + '/' + 
    (new Date(this._user.createdAt.toString()).getMonth() + 1) + '/' + 
    new Date(this._user.createdAt.toString()).getFullYear();

    if (this._roleList) {
      const role = this._roleList.find(role => role._id === this._user!.roleId);
      if (role) {
        this.role = role.name;
      }
    }
    
  }

}
