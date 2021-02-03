import { Type } from 'class-transformer';
import * as crypto from 'crypto';
import { BaseEntity, BeforeInsert, Column, Entity, Index, PrimaryColumn } from 'typeorm';

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

  @BeforeInsert()
  async hashVoterId() {
    this.voterHash = crypto.createHash('sha512').update(this.voterHash).digest('hex');
  }
}
