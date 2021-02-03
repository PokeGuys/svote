import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { PollOption } from './poll-options.entity';
import { Poll } from './poll.entity';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepo: Repository<Poll>,
    @InjectRepository(PollOption)
    private readonly pollOptionRepo: Repository<PollOption>,
  ) {}

  public async createPoll(
    hkid: string,
    title: string,
    options: string[],
    startAt: number,
    endAt: number,
  ): Promise<Poll> {
    const poll = new Poll();
    poll.title = title;
    poll.creatorId = hkid;
    poll.startAt = dayjs.unix(startAt).toDate();
    poll.endAt = dayjs.unix(endAt).toDate();
    await this.pollRepo.save(poll);
    poll.options = options.map((optionDescription) => {
      const option = new PollOption();
      option.text = optionDescription;
      option.poll = poll;
      return option;
    });
    await this.pollOptionRepo.save(poll.options);

    return poll;
  }
}