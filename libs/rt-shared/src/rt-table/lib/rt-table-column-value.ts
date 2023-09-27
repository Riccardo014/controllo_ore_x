import { TableConfigurationColumn } from '@api-interfaces';

export function rtTableColumnValue(column: TableConfigurationColumn, entity: any): any {
  const splitField: string[] = column.field.split('.');
  let actualValue: any = entity;
  for (let i: number = 0; i < splitField.length; i++) {
    if (actualValue) {
      actualValue = actualValue[splitField[i]];
    }
  }

  return column.transformFn ? new Function('return ' + column.transformFn)()(entity) : actualValue;
}
