import {Database} from '@src/dataProvider/database';
import Joi from 'joi';
import {Knex} from 'knex';
import {Result, TransactionFull, TransactionProps} from './core/types';
import {msg} from './shared';
const db = Database.tables as Knex;

(async () => {
  const _result = await db<TransactionFull>('transactions as t')
    .leftJoin('users as u', 't.userid', 'u.id')
    .leftJoin('categories as c', 't.categoryid', 'c.id')
    .select(
      't.id',
      't.day',
      't.month',
      't.year',
      't.value',
      't.description',
      't.createdAt',
      't.updatedAt',
      'c.description as category',
      'u.name as user',
      'u.email'
    )
    .orderBy('t.day', 't.month');

  //console.log(_result);
})();

class Transaction {
  readonly props: TransactionProps;

  private constructor(args: TransactionProps) {
    this.props = args; //code...
  }

  static make(args: TransactionProps): Result<Transaction> {
    try {
      const isValid = Transaction.validate(args);

      if (isValid.isFailure) {
        return Result.fail(msg.error.failedCreatedObject);
      }

      return Result.ok(new this(args));
    } catch (error) {
      return Result.fail(msg.error.failedCreatedObject);
    }
  }

  static validate(args: TransactionProps): Result<boolean> {
    try {
      const schema = Joi.object({
        day: Joi.number().min(1).max(31).required(),
        month: Joi.number().min(1).max(12).required(),
        year: Joi.number().required(),
        description: Joi.string().required(),
        value: Joi.number().min(1).required(),
        data: Joi.string().required(),
        userid: Joi.string().required(),
        categoryid: Joi.string().required(),
      });

      const { error } = schema.validate(args);

      if (error) {
        return Result.fail(error.message);
      }

      return Result.ok(true);
    } catch (error) {
      return Result.fail(msg.error.failedCreatedObject);
    }
  }

  toData(): Result<TransactionProps> {
    return Result.ok(this.props);
  }
}

const args: TransactionProps = {
  day: 1,
  month: 2,
  year: 2012,
  value: 12.1,
  description: 'babla bla',
  data: '12/12/2012',
  userid: '1',
  categoryid: '2',
};

const d = Transaction.make(args);

if (d.isFailure) {
  console.log(d.error.toString());
} else {
  console.log(d.getValue().props.day);
  console.log(d.getValue().toData());
}
