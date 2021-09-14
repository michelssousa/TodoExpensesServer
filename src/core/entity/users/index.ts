/* eslint-disable no-useless-escape */
import { Result, UserProps } from '@src/core/types';
import { msg } from '@src/shared';
import * as bcrypt from 'bcryptjs';
import config from 'config';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  data: string;
}

export class Users {
  readonly props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
    if (props.id) {
      this.props.password = this.ashPassword(props.password as string);
      this.props.accountVerified = false;
    }
  }

  private hashSync(size: number): string {
    let _result = '';
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < size; i++) {
      _result += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    }
    return _result;
  }

  toData(): Result<UserProps> {
    this.props.passwordDuo = config.get('App.Auth.key');
    return Result.ok(this.props);
  }

  resetPassword(): Result<string> {
    const size = this.getRandonInt(2, 9);
    this.props.password = this.hashSync(size);
    this.props.accountVerified = true;
    return Result.ok<string>(this.props.password as string);
  }

  compare(email: string, password: string): Result<boolean> {
    const _hashPassword = this.props.password as string;
    const _email = this.props.email as string;
    const _infoPassword = password as string;

    if (_email !== email) {
      return Result.ok(false);
    }

    // aqui deve verificar se ele envio a senha master

    const _result = bcrypt.compareSync(_infoPassword, _hashPassword);

    return Result.ok(_result);
  }

  static make(params: UserProps): Result<Users> {
    try {
      const usersValidateOrError = Users.validate(params);

      if (usersValidateOrError.isFailure) {
        return Result.fail(msg.error.failedCreatedObject);
      }

      return Result.ok<Users>(new this(params));
    } catch (error) {
      return Result.fail<Users>(msg.error.failedCreatedObject);
    }
  }

  private getRandonInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private ashPassword(password: string): string {
    const size = this.getRandonInt(8, 10);
    return bcrypt.hashSync(password, bcrypt.genSaltSync(size));
  }

  tokenGeneration(): Result<string> {
    const jwtKey = this.props.passwordDuo as string;

    const expiresIn = config.get('App.Auth.expiration_time') as string;

    const _result = jwt.sign({ data: this.props.id }, jwtKey, {
      expiresIn: expiresIn,
    });

    if (_result) {
      return Result.ok(_result);
    } else {
      return Result.fail(msg.error.failedCreatedObject);
    }
  }

  tokenVerify(token: string): Result<boolean> {
    try {
      const jwtKey = this.props.passwordDuo as string;
      const jwtDecode = jwt.verify(token, jwtKey);
      const { data } = jwtDecode as TokenPayload;

      if (data === this.props.id) {
        return Result.ok(true);
      }

      return Result.ok(false);
    } catch (error) {
      return Result.fail(msg.error.token);
    }
  }

  static validate(params: UserProps): Result<boolean> {
    try {
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])(?:([0-9a-zA-Z$*&@#])(?!\1)){6,20}$/;

      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      const schema = Joi.object({
        id: Joi.string().optional(),
        name: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().pattern(emailRegex),
        password: Joi.string()
          .pattern(passwordRegex)
          .message(msg.error.password),
        passwordDuo: Joi.optional(),
        accountVerified: Joi.boolean().optional(),
        createdAt: Joi.string().optional(),
        updateAt: Joi.string().optional(),
      });

      const { error } = schema.validate(params);

      if (error) {
        return Result.fail(error.message);
      }

      return Result.ok(true);
    } catch (error) {
      return Result.fail(msg.error.failedCreatedObject);
    }
  }
}
