import { MigrationInterface, QueryRunner } from 'typeorm'

export class MockUsers1622348668437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        insert into User_Account (id, username, email, password, "createdAt", "updatedAt") values (2, 'sbauldry0', 'ctrewett0@unicef.org', 'jhZk91W5W', '4/18/2021', '7/22/2020');
insert into User_Account (id, username, email, password, "createdAt", "updatedAt") values (3, 'gduiguid1', 'asallnow1@dell.com', 'U58IqmAs', '3/2/2021', '8/7/2020');
insert into User_Account (id, username, email, password, "createdAt", "updatedAt") values (4, 'dwrey2', 'sportress2@google.com.au', 'MjoXnUBNnE', '1/23/2021', '10/5/2020');
insert into User_Account (id, username, email, password, "createdAt", "updatedAt") values (5, 'hwebley3', 'whauxby3@live.com', 'aclMGjnKB4jC', '12/2/2020', '5/7/2021');
insert into User_Account (id, username, email, password, "createdAt", "updatedAt") values (6, 'lscourgie4', 'kkerwick4@pen.io', '6slgst6', '6/28/2020', '3/13/2021');
insert into User_Account (id, username, email, password, "createdAt", "updatedAt") values (7, 'hbrundall5', 'teaglestone5@tmall.com', 'hgmvqTD', '11/10/2020', '11/26/2020');
        `)
  }

  public async down(_: QueryRunner): Promise<void> {}
}
