import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PollOption } from './poll-options.entity';
import { Vote } from './vote.entity';

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

  @Column('boolean')
  isEnded: boolean;

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

  @OneToOne(() => Vote, (vote) => vote.poll)
  @JoinColumn({ name: 'pollId', referencedColumnName: 'pollId' })
  vote?: Vote | null;
}
