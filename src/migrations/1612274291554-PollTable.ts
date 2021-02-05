import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class PollTable1612274291554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'polls',
        columns: [
          {
            name: 'pollId',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'creatorId',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'count',
            type: 'int',
            unsigned: true,
            default: 0,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: false,
          },
          {
            name: 'isEnded',
            type: 'boolean',
            default: false,
          },
          {
            name: 'startAt',
            type: 'DATE',
          },
          {
            name: 'endAt',
            type: 'DATE',
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

    await queryRunner.createIndices('polls', [
      new TableIndex({
        columnNames: ['startAt'],
      }),
      new TableIndex({
        columnNames: ['endAt'],
      }),
      new TableIndex({
        columnNames: ['isActive'],
      }),
      new TableIndex({
        columnNames: ['isEnded'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('DROP TABLE polls');
  }
}
