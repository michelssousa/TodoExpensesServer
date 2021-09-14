import {
  BaseRespositories,
  CategoryDTO,
  CategoryRepo,
  Crud,
  TransactionDTO,
  TransactionsRep,
  UsersDTO,
  UsersRepo,
} from '@src/core/database';
import { Entity, Result } from '@src/core/types';
import { Database, tables } from '@src/dataProvider/database';
import { msg } from '@src/shared';
import { Knex } from 'knex';

abstract class BaseRepository<T extends Entity> implements Crud<T> {
  protected conn: Knex;
  protected table: string;

  constructor(table: string) {
    this.conn = Database.tables as Knex;
    this.table = table;
  }

  async getById(id: string): Promise<Result<T>> {
    return await this.conn(this.table)
      .where({ id })
      .first()
      .then((res) => Result.ok<T>(res))
      .catch(() => Result.fail(msg.error.failedResult));
  }

  async create(params: Partial<T>): Promise<Result<number[]>> {
    return await this.conn(this.table)
      .insert(params)
      .then((res) => Result.ok<number[]>(res))
      .catch(() => Result.fail(msg.error.databaseSave));
  }

  async update(id: string, params: Partial<T>): Promise<Result<number>> {
    return await this.conn(this.table)
      .where({ id })
      .first()
      .update(params)
      .then((res) => Result.ok<number>(res))
      .catch(() => Result.fail(msg.error.databaseUpdate));
  }

  async delete(id: string): Promise<Result<number>> {
    return await this.conn(this.table)
      .where({ id })
      .first()
      .del()
      .then((res) => Result.ok<number>(res))
      .catch(() => Result.fail(msg.error.databaseDelete));
  }
}

class UsersRepository extends BaseRepository<UsersDTO> implements UsersRepo {
  private constructor() {
    super(tables.users);
    Object.freeze(this);
  }

  async getByEmail(email: string): Promise<Result<UsersDTO>> {
    return await this.conn(this.table)
      .where({ email })
      .first()
      .then((res) => Result.ok<UsersDTO>(res))
      .catch(() => Result.fail(msg.error.databasefind));
  }

  public static make(): Result<UsersRepository> {
    return Result.ok<UsersRepository>(new UsersRepository());
  }
}

class CategoryRepository
  extends BaseRepository<CategoryDTO>
  implements CategoryRepo
{
  private constructor() {
    super(tables.categories);
    Object.freeze(this);
  }

  async getAll(): Promise<Result<CategoryDTO[]>> {
    return await this.conn(this.table)
      .then((res) => Result.ok<CategoryDTO[]>(res))
      .catch(() => Result.fail(msg.error.databasefind));
  }

  async getByDescription(description: string): Promise<Result<CategoryDTO>> {
    return await this.conn(this.table)
      .where({ description })
      .first()
      .then((res) => Result.ok<CategoryDTO>(res))
      .catch(() => Result.fail(msg.error.failedResult));
  }

  public static make(): Result<CategoryRepository> {
    return Result.ok<CategoryRepository>(new CategoryRepository());
  }
}

class TransactionsRepository
  extends BaseRepository<TransactionDTO>
  implements TransactionsRep
{
  private constructor() {
    super(tables.transactions);
    Object.freeze(this);
  }
  public static make(): Result<TransactionsRepository> {
    return Result.ok<TransactionsRepository>(new TransactionsRepository());
  }

  async getAllByMonth(
    startMonth: number,
    endMonth: number,
    year: number
  ): Promise<Result<TransactionDTO[]>> {
    return await this.conn(this.table)
      .where({ year })
      .whereBetween('month', [startMonth, endMonth])
      .then((res) => Result.ok<TransactionDTO[]>(res))
      .catch(() => Result.fail(msg.error.databasefind));
  }
}

export class Repositories implements BaseRespositories {
  readonly users: UsersRepo;
  readonly categories: CategoryRepo;
  readonly transactions: TransactionsRep;

  private constructor() {
    const userRepoOrError: Result<UsersRepo> = UsersRepository.make();
    const categoryRepoOrError: Result<CategoryRepo> = CategoryRepository.make();
    const transactionRepoOrError: Result<TransactionsRep> =
      TransactionsRepository.make();

    const propsResult: Result<any> = Result.combine([
      userRepoOrError,
      categoryRepoOrError,
      transactionRepoOrError,
    ]);

    if (propsResult.isFailure) {
      throw new Error(msg.error.failingOperation);
    }

    this.users = userRepoOrError.getValue();
    this.transactions = transactionRepoOrError.getValue();
    this.categories = categoryRepoOrError.getValue();
    this.categories = categoryRepoOrError.getValue();
    Object.freeze(this);
  }

  public static make(): Result<Repositories> {
    return Result.ok<Repositories>(new Repositories());
  }
}
