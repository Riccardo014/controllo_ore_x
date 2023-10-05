import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { FindBoostedWhereOption, TableConfiguration } from '@api-interfaces';
import { RtTableStatus } from '../../interfaces/rt-table-status.interface';

@Component({
  selector: 'lib-rt-table',
  templateUrl: './rt-table.component.html',
  styleUrls: ['./rt-table.component.scss'],
})
export class RtTableComponent {
  @Input() status!: RtTableStatus;

  @Input() tableConfiguration!: TableConfiguration;
  @Input() data!: any[];

  @Input() shouldShowFilters: boolean = true;

  @Input() isFirstColumnHidden: boolean = false;
  @Input() isPrintMode: boolean = false;
  @Input() isTableTopbarVisible: boolean = true;
  @Input() isTableHeaderVisible: boolean = true;

  @Input() isLoading: boolean = true;

  // Needed to override automatic linking
  @Input() editFn?: (entity: any) => void | Promise<void>;
  @Input() editIcon?: string;

  @Output() statusChangeEmitter: EventEmitter<RtTableStatus> =
    new EventEmitter<RtTableStatus>();

  @Output() openFilterEmitter: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() openDialogEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Input() thPrefixTemplate?: TemplateRef<any>;
  @Input() thSuffixTemplate?: TemplateRef<any>;
  @Input() tdPrefixTemplate?: TemplateRef<any>;
  @Input() tdSuffixTemplate?: TemplateRef<any>;

  @Input() isEditAvailable: boolean = true;

  constructor(private _paginator: MatPaginatorIntl) {
    _paginator.itemsPerPageLabel = 'Elementi per pagina';
  }

  openFilterFn(): void {
    this.openFilterEmitter.emit(true);
  }

  openDialogFn(entity: any): void {
    this.openDialogEmitter.emit(entity);
  }

  updateFilters(filters: FindBoostedWhereOption[]): void {
    this.status.where = filters;
    this.statusChangeEmitter.emit(this.status);
  }

  updateFulltextSearch(fulltextSearch: string): void {
    this.status.fulltextSearch = fulltextSearch;
    this.statusChangeEmitter.emit(this.status);
  }

  updateOrder(orderBy: any): void {
    this.status.order = orderBy;
    this.statusChangeEmitter.emit(this.status);
  }

  updatePagination(pageEvent: PageEvent): void {
    if (!this.status.pagination) {
      return;
    }

    let newPage: number = this.status.pagination.currentPage;
    let itemsPerPage: number = this.status.pagination.itemsPerPage;

    if (this.status.pagination) {
      if (pageEvent.previousPageIndex !== pageEvent.pageIndex) {
        newPage = pageEvent.pageIndex + 1;
      }

      if (pageEvent.pageSize !== itemsPerPage) {
        if (itemsPerPage !== undefined) {
          newPage = 1; //reset to first page
        }

        itemsPerPage = pageEvent.pageSize;
      }

      this.status.pagination.currentPage = newPage;
      this.status.pagination.itemsPerPage = itemsPerPage;
      this.statusChangeEmitter.emit(this.status);
    }
  }

  isPaginatorVisible(): boolean {
    if (this.tableConfiguration && this.status) {
      if (
        !this.tableConfiguration.pagination?.disabled ||
        !this.status.pagination
      ) {
        return true;
      }
    }
    return false;
  }
}
