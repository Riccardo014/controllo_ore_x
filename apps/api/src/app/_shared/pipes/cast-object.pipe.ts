import { Injectable, PipeTransform } from '@nestjs/common';
import * as _ from 'lodash';

@Injectable()
export class CastObjectPipe implements PipeTransform {
  transform(value: any): any {
    let result: any = {};
    for (const key of Object.keys(value)) {
      const segments: string[] = key.split('.');
      let supportObject: any = {
        [segments[segments.length - 1]]: value[key],
      };
      for (let i: any = segments.length - 2; i >= 0; i--) {
        supportObject = {
          [segments[i]]: supportObject,
        };
      }
      result = _.merge(result, supportObject);
    }

    return result;
  }
}
