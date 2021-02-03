import { Type } from 'class-transformer';
import * as crypto from 'crypto';
import { BaseEntity, BeforeInsert, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PollOption } from './poll-options.entity';

@Entity('polls')
export class Poll extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  pollId: string;

  @Column('varchar')
  creatorId: string;

  @Column('varchar')
  title: string;

  @Column('int')
  count: number;

  @Column('boolean')
  isActive: boolean;

  @Column('date')
  @Type(() => Date)
  startAt: Date;

  @Column('date')
  @Type(() => Date)
  endAt: Date;

  @Column('timestamp')
  @Type(() => Date)
  createdAt: Date;

  @Column('timestamp')
  @Type(() => Date)
  updatedAt: Date;

  @OneToMany(() => PollOption, (option) => option.poll)
  @JoinColumn({ name: 'pollId', referencedColumnName: 'pollId' })
  options: PollOption[];

  @BeforeInsert()
  async hashCreatorId() {
    this.creatorId = crypto.createHash('sha512').update(this.creatorId).digest('hex');
  }
}
