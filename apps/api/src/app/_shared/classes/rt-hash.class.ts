/**
 * @version 1.0.0
 *
 * Snippet Name: user
 * Summary: RtHash
 * Description: This is the raintonic hashing class.
 * This contain two methods, the generate and the compare.
 * The generate method is used to hash a string.
 * The compare is used to check if a string is equal to a hashed string.
 * This is used for hash the user password, and in the login method to check if the digited password is equal to the
 * user password.
 *
 * File Changelog
 *
 * Author                      | Date            | Changes
 * =====================================================================================================================
 * Mario Tonello               | 22/02/2021      | Imported RtHash from lib folder
 * Mario Tonello               | 02/03/2021      | Removed some lint error
 */

import * as crypto from 'crypto';

export class RtHash {
  static readonly digest: string = 'sha512';
  static readonly iterations: number = 99999;
  static readonly keyLength: number = 20;

  static generate(str: string): Promise<string> {
    const executor = (resolve: (_: any) => void, reject: (_: any) => void): void => {
      const callback = (error: any, salt: any): void => {
        if (error) {
          return reject(error);
        }

        const callback2 = (error2: any, key: any): void => {
          if (error2) {
            return reject(error2);
          }

          const buffer: Buffer = Buffer.alloc(this.keyLength * 2);

          salt.copy(buffer);
          key.copy(buffer, salt.length);

          resolve(buffer.toString('base64'));
        };

        crypto.pbkdf2(str, salt, this.iterations, this.keyLength, this.digest, callback2);
      };

      crypto.randomBytes(this.keyLength, callback);
    };

    return new Promise(executor);
  }

  static compare(str: string, hash: string): Promise<boolean> {
    const executor = (resolve: (_: any) => void, reject: (_: any) => void): void => {
      const buffer: Buffer = Buffer.from(hash, 'base64');
      const salt: Buffer = buffer.slice(0, this.keyLength);
      const keyA: Buffer = buffer.slice(this.keyLength, this.keyLength * 2);

      const callback = (error: any, keyB: any): void => {
        if (error) {
          return reject(error);
        }
        resolve(keyA.compare(keyB) === 0);
      };

      crypto.pbkdf2(str, salt, this.iterations, this.keyLength, this.digest, callback);
    };

    return new Promise(executor);
  }
}
