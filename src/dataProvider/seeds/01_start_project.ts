import { tables } from '@src/dataProvider/database';
import config from 'config';
import * as fake from 'faker';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  const password = config.get('App.Auth.key');

  const today = new Date();
  const dd = Math.floor(Math.random() * 30);
  const mm = Math.floor(Math.random() * 10);
  const yyyy = today.getFullYear();

  const value = Math.floor(Math.random() * 1000);

  await knex(tables.users).del();
  await knex(tables.categories).del();
  await knex(tables.transactions).del();

  await knex(tables.users)
    .del()
    .insert([
      {
        name: fake.name.findName(),
        email: fake.internet.email(),
        password: password,
        passwordDuo: password,
      },
      {
        name: fake.name.findName(),
        email: fake.internet.email(),
        password: password,
        passwordDuo: password,
      },
    ]);

  const users = await knex(tables.users)
    .select('id')
    .then((rm) => {
      return rm;
    });

  await knex(tables.categories).insert([
    { description: 'alimentacao' },
    { description: 'habitacao' },
    { description: 'combustiveis' },
    { description: 'transportes' },
    { description: 'educacao' },
    { description: 'vestuario' },
    { description: 'servicos' },
    { description: 'lazer' },
    { description: 'diversos' },
    { description: 'entradas' },
  ]);

  const categories = await knex(tables.categories)
    .select('id')
    .then((rm) => {
      return rm;
    });

  await knex(tables.transactions).insert([
    {
      date: fake.date.recent(),
      value: value + 20,
      description: fake.lorem.words(),
      month: mm,
      year: yyyy,
      day: dd,
      userid: users[0]['id'],
      categoryid: categories[0]['id'],
    },
    {
      date: fake.date.recent(),
      value: value + 10,
      description: fake.lorem.words(),
      month: mm + 3,
      year: yyyy,
      day: dd + 2,
      userid: users[1]['id'],
      categoryid: categories[3]['id'],
    },
    {
      date: fake.date.recent(),
      value: value + 4,
      description: fake.lorem.words(),
      month: mm + 1,
      year: yyyy,
      day: dd + 3,
      userid: users[1]['id'],
      categoryid: categories[2]['id'],
    },
  ]);
}
