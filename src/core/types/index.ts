import { CategoryDTO, TransactionDTO, UsersDTO } from '@src/core/database';
import { msg } from '@src/shared';

export type Entity = {};
export type UserProps = Partial<UsersDTO>;
export type CategoryProps = Partial<CategoryDTO>;
export type TransactionProps = Partial<TransactionDTO>;

export type TransactionFull = {
  id: string;
  day: number;
  month: number;
  year: number;
  value: number;
  description: string;
  created: string;
  update: string;
  category: string;
  user: string;
  email: string;
};

export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  public readonly error: T | string;
  private readonly _value: T | any;

  public constructor(isSuccess: boolean, error?: string | T, value?: T) {
    if (isSuccess && error) {
      throw new Error(msg.error.invalidOperation);
    }

    if (!isSuccess && !error) {
      throw new Error(msg.error.failingOperation);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error as T;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      return this.error as T;
    }
    return this._value;
  }

  public static ok<U>(value?: U): Result<U> {
    try {
      return new Result<U>(true, undefined, value);
    } catch (error) {
      throw new Error(msg.error.invalidOperation);
    }
  }

  public static fail<U>(error: any): Result<U> {
    try {
      return new Result<U>(false, error);
    } catch (error) {
      throw new Error(msg.error.invalidOperation);
    }
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok<any>();
  }
}

export type Either<L, A> = Left<L, A> | Right<L, A>;

export class Left<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return true;
  }

  isRight(): this is Right<L, A> {
    return false;
  }
}

export class Right<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return false;
  }

  isRight(): this is Right<L, A> {
    return true;
  }
}

export const left = <L, A>(l: L): Either<L, A> => {
  return new Left(l);
};

export const right = <L, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a);
};
