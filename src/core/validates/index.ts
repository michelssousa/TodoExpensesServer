import { msg } from '@src/shared';
import Joi, { ObjectSchema } from 'joi';

const validate = (
  check: object,
  schema: ObjectSchema,
  info: string
): boolean | never => {
  try {
    const { error } = schema.validate(check);
    if (error) {
      return false;
    }
    return true;
  } catch (k) {
    throw new Error(msg.error.function(info));
  }
};

export const usersValidate = (user: object): boolean | never => {
  const schema = Joi.object({
    mi: Joi.string().max(2),
  });
  return validate(user, schema, 'usersValidate');
};

export const transactionsValidate = (transaction: object): boolean | never => {
  const schema = Joi.object({
    mi: Joi.string().max(2),
  });
  return validate(transaction, schema, 'transactionValidate');
};

export const categoriesValidate = (category: object): boolean | never => {
  const schema = Joi.object({
    mi: Joi.string().max(2),
  });
  return validate(category, schema, 'categoriesValidate');
};
