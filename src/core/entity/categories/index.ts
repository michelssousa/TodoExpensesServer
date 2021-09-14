import { CategoryProps, Result } from '@src/core/types';
import { msg } from '@src/shared';
import Joi from 'joi';

export class Categories {
  readonly args: CategoryProps;
  private constructor(args: CategoryProps) {
    this.args = args;
  }
  static make(args: CategoryProps): Result<Categories> {
    try {
      const categoriesOrError = Categories.validate(args);

      if (categoriesOrError.isFailure) {
        return Result.fail(msg.error.failedCreatedObject);
      }

      return Result.ok<Categories>(new this(args));
    } catch (j) {
      return Result.fail(msg.error.failedCreatedObject);
    }
  }

  static validate(args: CategoryProps): Result<boolean> {
    try {
      const schema = Joi.object({
        id: Joi.string().optional(),
        description: Joi.string().min(3).max(100).required(),
        createdAt: Joi.string().optional(),
        updatedAt: Joi.string().optional(),
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

  toData(): Result<CategoryProps> {
    return Result.ok(this.args);
  }
}
