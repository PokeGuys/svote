import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Poll } from './poll.entity';

@Entity('poll_options')
export class PollOption extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  optionId: string;

  @Column('uuid')
  pollId: string;

  @Column('varchar')
  text: string;

  @Column('int')
  count: number;

  @Column('timestamp')
  @Type(() => Date)
  createdAt: Date;

  @Column('timestamp')
  @Type(() => Date)
  updatedAt: Date;

  @ManyToOne(() => Poll, (poll) => poll.options, { eager: true })
  @JoinColumn({ name: 'pollId', referencedColumnName: 'pollId' })
  poll: Poll;
}
