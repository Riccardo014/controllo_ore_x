import { GoneException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LoginDtoV } from './login.dtov';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthToken } from './auth-token.entity';
import { Repository } from 'typeorm';
import { addMinutes, isBefore } from 'date-fns';
import { ApiErrors } from '@shared/utils/errors/api-errors';

@Injectable()
export class AuthService {

  private static readonly _DEFAULT_TOKEN_EXPIRATION_MINUTES: number = 180;

  private readonly _jsonwebtokenSecret: string;
  private readonly _tokenExpirationMinutes: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly _isTokenExpirationEnabled: boolean;

  constructor( 
    private _userService: UserService,
    private _configService: ConfigService,     
    @InjectRepository(AuthToken)
    private _authTokenRepository: Repository<AuthToken>
  ) {
    this._jsonwebtokenSecret = this._configService.get<string>('JWT_SIGN_SECRET');
    this._tokenExpirationMinutes = 
      this._configService.get<number>('TOKEN_EXPIRATION_MINUTES') || AuthService._DEFAULT_TOKEN_EXPIRATION_MINUTES;
    this._isTokenExpirationEnabled = this._configService.get<string>('ENABLE_TOKEN_EXPIRATION') === 'true';

  }

  /**
   * Authenticates a user based on a provided authentication token.
   * @param token The authentication token to be validated.
   * @throws NotFoundException if the token is not found.
   * @throws GoneException if token expiration is enabled and the token is expired.
   * @returns A Promise that resolves to the authenticated user.
   */
  async authenticate(token: string): Promise<User> {
    const loginToken: AuthToken = await this._authTokenRepository.findOne({ where: { token } });
    if (!loginToken) {
      throw new NotFoundException(ApiErrors.MISSING_TOKEN);
    }
    if (this._isTokenExpirationEnabled && isBefore(loginToken.validUntil, new Date())) {
      throw new GoneException(ApiErrors.EXPIRED_TOKEN);
    }

    loginToken.validUntil = this._getNewTokenValidUntil();

    await this._authTokenRepository.save(loginToken);
    return this._userService.getOne(loginToken.userId);
  }

  /**
   * This method handles user login.
   * @param body LoginDtoV object containing email and password
   * @returns An object containing the user and the JWT token generated.
   */
  async login(body: LoginDtoV): Promise<{ user: User, token: string }> {      
    const currentUser: User = await this._userService.getUserByEmailAndPassword(body.email, body.password);
    return {
      user: currentUser,
      token: await this.generateJWT(currentUser),
    };
  }

  /**
   * This method generate and save a jwt for a user passed as parameter. Token has a validity set with _tokenExpirationMinutes parameter.
   * @param user The user to generate the token for.
   * @returns The generated token.
   */
    async generateJWT(user: User): Promise<string> {
      const jwt: any = sign({ id: user._id }, this._jsonwebtokenSecret);
  
      await this._authTokenRepository.save(
        this._authTokenRepository.create({
          token: jwt,
          userId: user._id,
          validUntil: this._getNewTokenValidUntil(),
        })
      );
      return jwt;
    }

  /**
   * Return the new expiration date of a token. It is the actual date plus an amount of minutes
   * defined in the env file(TOKEN_EXPIRATION_MINUTES), or, if not defined, a static value
   * defined at the top of this file.
   * @returns The new expiration date of a token.
   */
  private _getNewTokenValidUntil(): Date {
    return addMinutes(new Date(), this._tokenExpirationMinutes);
  }


}
