import { TableConfiguration } from '@api-interfaces';
import { RtTableStatus } from '../interfaces/rt-table-status.interface';

export abstract class RtTableStatusHandler<T> {
  tableConfiguration?: TableConfiguration;

  status: RtTableStatus = {
    pagination: { currentPage: 1, itemsPerPage: 10, totalItems: 0 },
    fulltextSearch: undefined,
    where: undefined,
  };

  data: T[] = [];

  /**
   * Changes the status of a RtTable instance and fetches data based on the new status.
   */
  async statusChange(newStatus: RtTableStatus): Promise<void> {
    this.status = newStatus;
    await this.fetchData();
  }

  abstract fetchData(): Promise<void> | void;
}
