import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import {
  AlertModule,
  RtDialogModule,
  RtInputModule,
  RtLoadingModule,
  RtSelectModule,
  RtTableModule,
} from '@controllo-ore-x/rt-shared';
import { SharedModule } from '@shared/shared.module';
import { ProjectReleaseTableLineComponent } from './components/project-release-table-line/project-release-table-line.component';
import { ProjectComponent } from './components/project/project.component';
import { ProjectUpsertPage } from './dialogs/project-upsert/project-upsert.page';
import { ProjectIndexPage } from './pages/project-index/project-index.page';
import { ReleaseIndexPage } from './pages/release-index/release-index.page';
import { ProjectRoutingModule } from './project-routing.module';

@NgModule({
  declarations: [
    ProjectIndexPage,
    ProjectComponent,
    ReleaseIndexPage,
    ProjectReleaseTableLineComponent,
    ProjectUpsertPage,
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    MatChipsModule,
    SharedModule,
    MatIconModule,
    MatMenuModule,
    RtTableModule,
    MatFormFieldModule,
    MatSelectModule,
    RtDialogModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RtInputModule,
    RtLoadingModule,
    AlertModule,
    RtSelectModule,
    MatExpansionModule,
    RtTableModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class ProjectModule {}
