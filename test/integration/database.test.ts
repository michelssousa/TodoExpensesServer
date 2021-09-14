import { Database } from '@src/dataProvider/database';
import config from 'config';
import * as fake from 'faker';

describe('Database', () => {
  beforeEach(async () => {
    return await Database.dropTables();
  });

  it('Should be able to created complete flow', async () => {
    const userRepo = Database.respositories().users;
    const categoryRepo = Database.respositories().categories;
    const transactionsRep = Database.respositories().transactions;

    const password = config.get('App.Auth.key');
    const today = new Date();
    const dd = Math.floor(Math.random() * 30);
    const mm = Math.floor(Math.random() * 10);
    const yyyy = today.getFullYear();
    const value = Math.floor(Math.random() * 1000);

    const userPre = {
      name: fake.name.findName(),
      email: fake.internet.email(),
      password: password,
      passwordDuo: password,
    };

    await userRepo.create(userPre);

    const user = await userRepo.getByEmail(userPre.email);

    const categoryPre = {
      description: 'Teste',
    };

    await categoryRepo.create(categoryPre);

    const category = await categoryRepo.getByDescription(
      categoryPre.description
    );

    const trans = {
      date: fake.date.recent(),
      value: value + 20,
      description: fake.lorem.words(),
      month: mm,
      year: yyyy,
      day: dd,
      userid: user.getValue().id,
      categoryid: category.getValue().id,
    };

    await transactionsRep.create(trans);

    const transBetween = await transactionsRep.getAllByMonth(mm, mm + 1, yyyy);

    expect(userPre.email).toEqual(user.getValue().email);
    expect(categoryPre.description).toEqual(category.getValue().description);
    expect(transBetween.getValue()).not.toBeNull();
  });

  afterEach(async () => {
    return await Database.dropTables();
  });
});
