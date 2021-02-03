import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class VoteTable1612327879313 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'votes',
        columns: [
          {
            name: 'optionId',
            type: 'uuid',
          },
          {
            name: 'pollId',
            type: 'uuid',
          },
          {
            name: 'voterHash',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'votes',
      new TableIndex({
        name: 'votes_unique',
        columnNames: ['pollId', 'voterHash', 'optionId'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE votes');
  }
}
