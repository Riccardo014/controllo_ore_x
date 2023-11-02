import {
  FIND_BOOSTED_FN,
  FULL_SEARCH_COLUMN_TYPE,
  FindBoostedCondition,
  FindBoostedOptions,
  FindBoostedOrder,
} from '@api-interfaces';
import { add } from 'date-fns';
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { FindBoostedResult } from './find-boosted-result.interface';

export class FindBoosted<T> {
  constructor(
    private _dataSource: DataSource,
    private _rootRepository: Repository<T>,
  ) {}

  /**
   * This method takes an object and builds the string with the given params
   * @param whereLogic
   * @param startingParent
   * @private
   */
  private static _buildWhereAndLogic(
    whereLogic: any,
    startingParent = '',
  ): string {
    // Check object, do recursive if not contains _fn
    let resultString: string = '1=1';
    for (const key of Object.keys(whereLogic)) {
      if (whereLogic[key] !== undefined) {
        // if element is an object
        if (
          typeof whereLogic[key] === 'object' &&
          !Array.isArray(whereLogic[key]) &&
          whereLogic[key] !== null
        ) {
          // if element contains _fn
          if (Object.keys(whereLogic[key]).find((k) => k === '_fn')) {
            resultString +=
              ' AND ' +
              FindBoosted._handleFnLogic(
                whereLogic[key],
                `${startingParent}.${key}`,
              );
          } else {
            // Recursive path
            resultString +=
              ' AND ' +
              FindBoosted._buildWhereAndLogic(
                whereLogic[key],
                `${startingParent}_${key}`,
              );
          }
        } else {
          // handle simple property
          if (typeof whereLogic[key] === 'number') {
            resultString += ` AND "${startingParent}"."${key}"=${whereLogic[key]}`;
          } else if (typeof whereLogic[key] === 'string') {
            resultString += ` AND "${startingParent}"."${key}"='${whereLogic[key]}'`;
          } else if (typeof whereLogic[key] === 'boolean') {
            resultString += ` AND "${startingParent}"."${key}"='${whereLogic[key]}'`;
          }
          // Check data
        }
      }
    }
    return `(${resultString})`;
  }

  /**
   * Handle fn logic for where clauses building
   * @param whereLogicElement
   * @param currentProperty
   * @private
   */
  private static _handleFnLogic(
    whereLogicElement: FindBoostedCondition,
    currentProperty: any,
  ): string {
    if (!whereLogicElement._fn) {
      throw new Error('Unprocessable _fn Function. _fn not set');
    }
    switch (whereLogicElement._fn) {
      case FIND_BOOSTED_FN.IS_NULL:
        return `${currentProperty} IS NULL`;
      case FIND_BOOSTED_FN.IS_NOT_NULL:
        return `${currentProperty} IS NOT NULL`;

      //boolean
      case FIND_BOOSTED_FN.BOOLEAN_EQUAL:
        return `${currentProperty} = ${whereLogicElement.args[0]}`;

      case FIND_BOOSTED_FN.STRING_NOT_EQUAL_OR_NULL:
        //            wheres.push('(' + key + ' != \'' + queryParam + '\' OR ' + key + ' IS NULL )');
        return `(${currentProperty} != '${whereLogicElement.args[0]}' OR ${currentProperty} IS NULL)`;

      //boolean
      case FIND_BOOSTED_FN.BOOLEAN_NOT_EQUAL:
        return `${currentProperty} != ${whereLogicElement.args[0]}`;

      //numbers
      case FIND_BOOSTED_FN.NUMBER_BETWEEN:
        return `${currentProperty} BETWEEN ${whereLogicElement.args[0]} AND ${whereLogicElement.args[1]}`;
      case FIND_BOOSTED_FN.NUMBER_IN:
        return `${currentProperty} IN (${whereLogicElement.args.join(',')})`;
      case FIND_BOOSTED_FN.NUMBER_GREATER:
        return `${currentProperty} > ${whereLogicElement.args}`;
      case FIND_BOOSTED_FN.NUMBER_GREATER_EQUAL:
        return `${currentProperty} >= ${whereLogicElement.args}`;
      case FIND_BOOSTED_FN.NUMBER_LOWER:
        return `${currentProperty} < ${whereLogicElement.args}`;
      case FIND_BOOSTED_FN.NUMBER_LOWER_EQUAL:
        return `${currentProperty} <= ${whereLogicElement.args}`;
      case FIND_BOOSTED_FN.NUMBER_EQUAL:
        return `${currentProperty} = ${whereLogicElement.args}`;
      case FIND_BOOSTED_FN.NUMBER_NOT_EQUAL:
        return `${currentProperty} <> ${whereLogicElement.args}`;
      // string
      case FIND_BOOSTED_FN.STRING_IN:
        return `${currentProperty} IN ('${whereLogicElement.args.join(
          "','",
        )}')`;
      case FIND_BOOSTED_FN.STRING_NOT_IN:
        return `${currentProperty} NOT IN (${whereLogicElement.args.join(
          ',',
        )})`;
      case FIND_BOOSTED_FN.STRING_LIKE:
        return `${currentProperty} ILIKE '%${whereLogicElement.args}%'`;

      //dates
      case FIND_BOOSTED_FN.DATE_BETWEEN:
        return `${currentProperty} BETWEEN '${whereLogicElement.args[0]}' AND '${whereLogicElement.args[1]}'`;
      case FIND_BOOSTED_FN.DATE_EQUAL: {
        const from: Date = new Date(whereLogicElement.args[0]);
        const to: Date = add(from, { days: 1 });
        return `(${currentProperty} BETWEEN '${from.toISOString()}' AND '${to.toISOString()}')`;
      }
      case FIND_BOOSTED_FN.DATE_NOT_IN:
        return `${currentProperty} NOT IN ('${whereLogicElement.args.join(
          ',',
        )}')`;
      case FIND_BOOSTED_FN.DATE_GREATER:
        return `${currentProperty} > '${whereLogicElement.args}'`;
      case FIND_BOOSTED_FN.DATE_GREATER_EQUAL:
        return `${currentProperty} >= '${whereLogicElement.args}'`;
      case FIND_BOOSTED_FN.DATE_LOWER:
        return `${currentProperty} < '${whereLogicElement.args}'`;
      case FIND_BOOSTED_FN.DATE_LOWER_EQUAL:
        return `${currentProperty} < '${whereLogicElement.args}'`;

      default:
        throw new Error('Unprocessable _fn Function. Value not recognized');
    }
  }

  /**
   * Execute the query with giving params
   * @param options
   * @param TX
   */
  async execute(
    options: FindBoostedOptions,
    TX?: EntityManager,
  ): Promise<FindBoostedResult<T>> {
    let queryBuilder: SelectQueryBuilder<T> = TX
      ? TX.createQueryBuilder(
          this._rootRepository.metadata.target,
          this._rootRepository.metadata.tableName,
        )
      : this._dataSource.createQueryBuilder(
          this._rootRepository.metadata.target,
          this._rootRepository.metadata.tableName,
        );

    // Adding relations with left join
    if (options.relations?.length > 0) {
      for (let relation of options.relations) {
        relation = this._rootRepository.metadata.tableName + '.' + relation;

        const relationSplit: string[] = relation.split('.');
        const currentRelationToAdd: string =
          relationSplit.slice(0, relationSplit.length - 1).join('_') +
          '.' +
          relationSplit[relationSplit.length - 1];
        const sanitizedRelationName: string = relationSplit.join('_');

        queryBuilder = queryBuilder.leftJoinAndSelect(
          currentRelationToAdd,
          sanitizedRelationName,
        );
      }
    }

    if (options.where) {
      queryBuilder = queryBuilder.where(this._buildWhere(options));
    }

    if (options.fulltextSearch && options.fullSearchCols) {
      const fullTextSearch: string = options.fulltextSearch;
      const fullSearchCols: (
        | string
        | {
            type: FULL_SEARCH_COLUMN_TYPE;
            field: string;
          }
      )[] = options.fullSearchCols;
      queryBuilder = queryBuilder.andWhere(
        this._buildWhereFullSearch(fullTextSearch, fullSearchCols),
      );
    }

    if (options.select) {
      queryBuilder = queryBuilder.select(options.select);
    }

    if (options.order) {
      queryBuilder = queryBuilder.orderBy(this._buildOrderBy(options.order));
    }

    if (options.pagination) {
      const skip: number =
        options.pagination.itemsPerPage * (options.pagination.currentPage - 1);
      queryBuilder = queryBuilder
        .take(options.pagination.itemsPerPage)
        .skip(skip);
    }

    if (options.logging) {
      // eslint-disable-next-line no-console
      console.log('[BOOSTED QUERY] ' + queryBuilder.getSql());
    }

    const [data, totalItems] = (await queryBuilder.getManyAndCount()) as [
      T[],
      number,
    ];
    return {
      data,
      pagination: {
        itemsPerPage: options.pagination ? options.pagination.itemsPerPage : -1,
        currentPage: options.pagination ? options.pagination.currentPage : -1,
        totalItems,
      },
    };
  }

  private _buildWhere(options: FindBoostedOptions): string {
    let whereClauseString: string = '';
    if (!options.where) {
      return '1=1';
    }

    if (Array.isArray(options.where)) {
      // In this case we have a or clause for each object
      options.where.forEach((whereLogic, index) => {
        whereClauseString += FindBoosted._buildWhereAndLogic(
          whereLogic,
          this._rootRepository.metadata.tableName,
        );
        if (index !== options.where.length - 1) {
          whereClauseString += ' OR ';
        }
      });
    } else {
      // Only a where clause with each element in AND logic operator
      whereClauseString += FindBoosted._buildWhereAndLogic(
        options.where,
        this._rootRepository.metadata.tableName,
      );
    }

    return whereClauseString;
  }

  /**
   * Create orderBy object
   * @param orderBy
   * @private
   */
  private _buildOrderBy(orderBy: FindBoostedOrder): FindBoostedOrder {
    const sanitizedOrderBy: any = {};

    for (const dbCol of Object.keys(orderBy)) {
      const sanitizedColName: string = this._sanitizeFieldName(dbCol);
      sanitizedOrderBy[sanitizedColName] = orderBy[dbCol];
    }

    return sanitizedOrderBy;
  }

  /**
   * Create where for fulltext params
   * @param fullSearch
   * @param dbCols
   * @private
   */
  private _buildWhereFullSearch(
    fullSearch: string,
    dbCols: (string | { type: FULL_SEARCH_COLUMN_TYPE; field: string })[],
  ): string {
    let where: string = '';

    const dbColsArray: (
      | string
      | { type: FULL_SEARCH_COLUMN_TYPE; field: string }
    )[] = Array.from(dbCols.values());

    // wrap for every fullSearch words
    where += '(';
    for (const [index, dbCol] of dbColsArray.entries()) {
      if (index !== 0) {
        where += ' OR ';
      }

      if (typeof dbCol === 'string') {
        const sanitizedFieldName: string = this._sanitizeFieldName(dbCol);
        where += `(${sanitizedFieldName} ILIKE '%${fullSearch.trim()}%')`;
      } else {
        switch (dbCol.type) {
          case FULL_SEARCH_COLUMN_TYPE.NUMBER: {
            const sanitizedFieldName: string = this._sanitizeFieldName(
              dbCol.field,
            );
            where += `(${sanitizedFieldName}::varchar(255) ILIKE '%${fullSearch.trim()}%')`;
            break;
          }
        }
      }
    }

    where += ')';

    // incapsulate sql OR statements
    where = '(' + where + ')';

    return where;
  }

  /**
   * returns rootTable.colName if first level
   * returns rootTable_col.nestedProperty fif nested
   */
  private _sanitizeFieldName(dbColName: string): string {
    let fieldName: string =
      this._rootRepository.metadata.tableName + '.' + dbColName;
    const splittedFieldName: string[] = fieldName.split('.');
    if (splittedFieldName.length > 2) {
      fieldName =
        splittedFieldName.slice(0, -1).join('_') +
        '.' +
        splittedFieldName[splittedFieldName.length - 1];
    }

    return fieldName;
  }
}
