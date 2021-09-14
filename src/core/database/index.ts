import { Result } from '@src/core/types';

export interface Crud<T> {
  getById: (id: string) => Promise<Result<T>>;
  create: (params: Partial<T>) => Promise<Result<number[]>>;
  update: (id: string, params: Partial<T>) => Promise<Result<number>>;
  delete: (id: string) => Promise<Result<number>>;
} //

export interface UsersDTO {
  id?: string;
  name: string;
  email: string;
  password: any;
  passwordDuo: any;
  accountVerified?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface TransactionDTO {
  id?: string;
  data: string;
  value: number;
  description: string;
  month: number;
  year: number;
  day: number;
  userid: string;
  categoryid: string;
  createdAt?: any;
  updatedAt?: any;
  category?: string;
  userName?: string;
  userEmail?: string;
}

export interface CategoryDTO {
  id?: string;
  description: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface UsersRepo extends Crud<UsersDTO> {
  getByEmail: (email: string) => Promise<Result<UsersDTO>>;
}

export interface CategoryRepo extends Crud<CategoryDTO> {
  getAll(): Promise<Result<CategoryDTO[]>>;
  getByDescription(description: string): Promise<Result<CategoryDTO>>;
}

export interface TransactionsRep extends Crud<TransactionDTO> {
  getAllByMonth: (
    startMonth: number,
    endMonth: number,
    year: number
  ) => Promise<Result<TransactionDTO[]>>;
}

export interface BaseRespositories {
  users: UsersRepo;
  categories: CategoryRepo;
  transactions: TransactionsRep;
}

export interface DB {
  tables: unknown;
  start: () => Promise<void>;
  dropTables: () => Promise<void>;
  destroy: () => Promise<void>;
  fake: () => Promise<void>;
  respositories: () => BaseRespositories;
}
