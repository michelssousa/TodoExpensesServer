import { Categories } from '@src/core/entity/categories';
import { Users } from '@src/core/entity/users';
import { CategoryProps, Result, UserProps } from '@src/core/types';

describe('Class Result', () => {
  it('Should return true', async () => {
    const myTeste = async (msg: string): Promise<Result<string>> => {
      if (msg == '') {
        return Result.fail<string>('wrong');
      }
      return Result.ok<string>(msg);
    };
    const result = myTeste('');
    const resultOrErro = await result.then((res) => res.isFailure);
    expect(resultOrErro).toBe(true);
  });
});

describe('Class Users', () => {
  it('Should be able create user class valid', async () => {
    const pass = 'Michel@1';

    const userPre: UserProps = {
      id: '123',
      name: 'Mihel',
      email: 'michelsousa7@outlook.com',
      password: pass,
      passwordDuo: pass,
    };

    const userOrError = Users.make(userPre);

    if (userOrError.isFailure) {
      throw new Error('deu pau nessa merda');
    }

    const user = userOrError.getValue();

    const token = user.tokenGeneration().getValue();

    const tokenVerify = user.tokenVerify(token);

    const password = '124';
    const email = 'michelsousa7@gmail.com';

    const result = user.compare(email, password).getValue();

    expect(token).not.toBeNull();
    expect(tokenVerify.getValue()).toBe(true);
    expect(result).toBe(false);
  });

  it('Should be not able create users class valid', async () => {
    const pass = 'Michel@1';

    const userPre: UserProps = {
      id: '123',
      name: 'Mi',
      email: 'michelsousaoutlook.com',
      password: pass,
      passwordDuo: pass,
    };

    const userOrError = Users.make(userPre);

    expect(userOrError.isFailure).toBe(true);
  });
});

describe('Class Categories', () => {
  it('should be able create categories class valid', async () => {
    const category: CategoryProps = {
      description: 'teste',
    };

    const categoriesOrError = Categories.make(category);

    expect(categoriesOrError.isFailure).toBe(false);
  });
});

describe('Class Categories', () => {
  it('should be not able create categories class valid', async () => {
    const category: CategoryProps = {
      description: 'te',
    };

    const categoriesOrError = Categories.make(category);

    expect(categoriesOrError.isFailure).toBe(true);
  });
});
