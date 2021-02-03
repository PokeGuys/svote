import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class PollOptionTable1612327861271 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'poll_options',
        columns: [
          {
            name: 'optionId',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'pollId',
            type: 'uuid',
          },
          {
            name: 'text',
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

    await queryRunner.createForeignKey(
      'poll_options',
      new TableForeignKey({
        columnNames: ['pollId'],
        referencedColumnNames: ['pollId'],
        referencedTableName: 'polls',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('DROP TABLE poll_options');
  }
}
