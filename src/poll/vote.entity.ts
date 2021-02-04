import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('votes')
@Index(['pollId', 'voterHash', 'optionId'], { unique: true })
export class Vote extends BaseEntity {
  @PrimaryColumn('uuid')
  pollId: string;

  @PrimaryColumn('varchar')
  voterHash: string;

  @PrimaryColumn('uuid')
  optionId: string;

  @Column('timestamp')
  @Type(() => Date)
  createdAt: Date;

  @Column('timestamp')
  @Type(() => Date)
  updatedAt: Date;
}
