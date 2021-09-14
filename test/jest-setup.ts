//import { SetupServer } from '@src/server';
//import supertest from 'supertest';
//
//let server: SetupServer;
//beforeAll(async () => {
//  server = new SetupServer();
//  await server.init();
//  global.testRequest = supertest(server.getApp());
//});
//

//afterAll(async () => await server.close());

import {Database} from '@src/dataProvider/database';

beforeAll(async () => {
  return await Database.dropTables();
});

afterAll(async () => {
  await Database.dropTables();
  await Database.fake();
  return await Database.destroy();
});
