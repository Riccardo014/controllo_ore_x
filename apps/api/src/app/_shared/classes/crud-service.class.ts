import { DataSource, DeleteResult, EntityManager, EntityTarget, Repository, UpdateResult } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { Inject } from '@nestjs/common';
import { FindBoosted, FindBoostedResult } from '@find-boosted';
import { FindBoostedOptions } from '@api-interfaces';

type CbTX<F> = (TX: EntityManager) => Promise<F>;

export abstract class CrudService<T, CreateDto, UpdateDto> {
  abstract target: EntityTarget<T>;
  @Inject(DataSource) protected _dataSource: DataSource;
  private _findBoosted?: FindBoosted<T>;

  /**
   * Creates a new value in db if it doesn't exits
   *
   * @param findConditions
   * @param data
   * @param TX
   */
  async upsert(findConditions: FindOptionsWhere<T>, data: CreateDto, TX?: EntityManager): Promise<T> {
    const element: Awaited<T> = await this.getRepository(TX).findOne({ where: findConditions });
    if (!element) {
      return this.create(data, TX);
    } else {
      await this.getRepository(TX).update(findConditions, data as any);
    }
    return this.getRepository(TX).findOneBy(findConditions);
  }

  /**
   * Creates a new value in db
   *
   * @param data
   * @param TX
   */
  create(data: CreateDto, TX?: EntityManager): Promise<T> {
    return this.getRepository(TX).save(data as unknown as T);
  }

  /**
   * Update one or more entities
   *
   * @param findConditions
   * @param data
   * @param TX
   */
  update(findConditions: string | FindOptionsWhere<T>, data: UpdateDto, TX?: EntityManager): Promise<UpdateResult> {
    return this.getRepository(TX).update(findConditions, data as any);
  }

  /**
   * Delete one or more entities
   *
   * @param findConditions
   * @param TX
   */
  delete(findConditions: string | FindOptionsWhere<T>, TX?: EntityManager): Promise<DeleteResult> {
    return this.getRepository(TX).delete(findConditions);
  }

  /**
   * Gets one result
   *
   * @param _id
   * @param relations
   * @param TX
   */
  getOne(_id: string, relations: string[] = [], TX?: EntityManager): Promise<T> {
    return this.getRepository(TX).findOne({ where: { _id } as any, relations });
  }

  /**
   * Gets one result
   *
   * @param conditions
   * @param relations
   * @param TX
   */
  getOneBy(conditions: FindOptionsWhere<T>, relations: string[] = [], TX?: EntityManager): Promise<T> {
    return this.getRepository(TX).findOne({ where: conditions, relations });
  }

  /**
   * Gets multiple results By using findBoosted
   *
   * @param findConditions
   * @param TX
   */
  getMany(findConditions: FindBoostedOptions, TX?: EntityManager): Promise<FindBoostedResult<T>> {
    if (!this._findBoosted) {
      this._findBoosted = new FindBoosted<T>(this._dataSource, this.getRepository());
    }
    return this._findBoosted.execute(findConditions, TX);
  }

  /**
   * Gets the repository of the current target
   *
   * @param TX
   */
  getRepository(TX?: EntityManager): Repository<T> {
    return TX ? TX.getRepository(this.target) : this._dataSource.getRepository(this.target);
  }

  /**
   * It handles a wrap in transaction. Checks if transaction is passed as parameter or wraps the code with it
   * @param cb
   * @param TX
   */
  async transactionWrap<X>(cb: CbTX<X>, TX?: EntityManager): Promise<X> {
    if (TX) {
      return cb(TX);
    } else {
      return this._dataSource.transaction<X>(cb);
    }
  }
}
