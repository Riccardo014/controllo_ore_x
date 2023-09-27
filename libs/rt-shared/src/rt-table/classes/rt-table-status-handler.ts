import { RtTableStatus } from '../interfaces/rt-table-status.interface';
import { TableConfiguration } from '@api-interfaces';

export abstract class RtTableStatusHandler<T> {
  tableConfiguration?: TableConfiguration;

  currentStatus: RtTableStatus = {
    pagination: { currentPage: 1, itemsPerPage: 10, totalItems: 0 },
    fulltextSearch: undefined,
    where: undefined,
  };

  data: T[] = [];

  async statusChange(newStatus: RtTableStatus): Promise<void> {
    this.currentStatus = newStatus;
    await this.fetchData();
  }

  abstract fetchData(): Promise<void> | void;
}
