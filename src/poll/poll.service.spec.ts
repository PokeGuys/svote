import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import IORedis from 'ioredis';
import { Repository } from 'typeorm';
import { REDIS_CLIENT } from '../app/redis/redis.constant';
import { PollAlreadyClosedException } from './exception/poll-already-closed.exception';
import { PollAlreadyVotedException } from './exception/poll-already-voted.exception';
import { PollNotFoundException } from './exception/poll-not-found.exception';
import { PollOption } from './poll-options.entity';
import { Poll } from './poll.entity';
import { PollService } from './poll.service';

const userId = 'fake-user-id';
const testPollTitle = 'Who is the best NBA player in history';
const testPollStartRange = [1611253120, 1614253120];
const testPollOptions = ['Michael Jordan', 'Kobe Bryant'];

describe('PollService', () => {
  const onePoll = new Poll();
  let onePollOption: PollOption;
  let pollOptionArray: PollOption[];
  let pollArray: Poll[];
  let service: PollService;
  let pollRepo: Repository<Poll>;
  let pollOptionRepo: Repository<PollOption>;
  let redis: IORedis.Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollService,
        {
          provide: getRepositoryToken(Poll),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              innerJoinAndSelect: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              clone: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockReturnValue([pollArray, 1]),
              getRawMany: jest.fn().mockReturnValue(pollArray),
              getCount: jest.fn().mockReturnValue(1),
            })),
          },
        },
        {
          provide: getRepositoryToken(PollOption),
          useValue: {
            save: jest.fn(),
            increment: jest.fn(),
            findOne: jest.fn().mockReturnValue(onePollOption),
            find: jest.fn().mockReturnValue(pollOptionArray),
          },
        },
        {
          provide: REDIS_CLIENT,
          useValue: {
            sismember: jest.fn().mockReturnValue(0),
            sadd: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PollService>(PollService);
    pollRepo = module.get<Repository<Poll>>(getRepositoryToken(Poll));
    pollOptionRepo = module.get<Repository<PollOption>>(getRepositoryToken(PollOption));
    redis = module.get<IORedis.Redis>(REDIS_CLIENT);

    const startDate = dayjs.unix(testPollStartRange[0]).startOf('day');
    const endDate = dayjs.unix(testPollStartRange[1]).startOf('day');
    onePoll.title = testPollTitle;
    onePoll.creatorId = userId;
    onePoll.startAt = startDate.toDate();
    onePoll.isActive = true;
    onePoll.isEnded = false;
    onePoll.endAt = endDate.toDate();
    onePoll.options = testPollOptions.map((text) => {
      const option = new PollOption();
      option.poll = onePoll;
      option.text = text;
      return option;
    });
    onePollOption = onePoll.options[0];

    pollOptionArray = onePoll.options;
    pollArray = [onePoll];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPoll', () => {
    it('should create a new poll', async () => {
      const pollRepoSpy = jest.spyOn(pollRepo, 'save');
      const pollOptionRepoSpy = jest.spyOn(pollOptionRepo, 'save');
      const result = await service.createPoll(
        userId,
        testPollTitle,
        testPollOptions,
        testPollStartRange[0],
        testPollStartRange[1],
      );
      expect(pollRepoSpy).toBeCalledTimes(1);
      expect(pollRepoSpy).toBeCalledWith(onePoll);
      expect(pollOptionRepoSpy).toBeCalledTimes(1);
      expect(pollOptionRepoSpy).toBeCalledWith(onePoll.options);

      expect(result).toEqual(onePoll);
    });
  });

  describe('getPolls', () => {
    it('should get an array of polls', async () => {
      const pollRepoSpy = jest.spyOn(pollRepo, 'createQueryBuilder');

      const result = await service.getPolls(1);
      expect(pollRepoSpy).toBeCalledTimes(1);
      expect(result.items).toEqual(pollArray);
    });
  });

  describe('vote', () => {
    it('should vote the poll', async () => {
      const pollOptionSpy = jest.spyOn(pollOptionRepo, 'findOne');
      await service.vote('a uuid', userId);
      expect(pollOptionSpy).toBeCalledWith({ optionId: 'a uuid' }, { relations: ['poll'] });
      expect(pollOptionSpy).toBeCalledTimes(1);
      expect(pollOptionRepo.increment).toBeCalledTimes(1);
    });

    it('should throw not found exception', async () => {
      const pollOptionSpy = jest.spyOn(pollOptionRepo, 'findOne').mockImplementation(() => Promise.resolve(undefined));
      expect(service.vote('a bad uuid', userId)).rejects.toThrowError(new PollNotFoundException());
      expect(pollOptionSpy).toBeCalledWith({ optionId: 'a bad uuid' }, { relations: ['poll'] });
      expect(pollOptionSpy).toBeCalledTimes(1);
    });

    it('should throw inactive poll exception', async () => {
      onePollOption.poll.isActive = false;
      const pollOptionSpy = jest.spyOn(pollOptionRepo, 'findOne').mockImplementation(async () => {
        return onePollOption;
      });
      expect(service.vote('a bad uuid', userId)).rejects.toThrowError(new PollNotFoundException());
      expect(pollOptionSpy).toBeCalledWith({ optionId: 'a bad uuid' }, { relations: ['poll'] });
      expect(pollOptionSpy).toBeCalledTimes(1);
    });

    it('should throw ended poll exception', async () => {
      onePollOption.poll.isEnded = true;
      const pollOptionSpy = jest.spyOn(pollOptionRepo, 'findOne').mockImplementation(async () => {
        return onePollOption;
      });
      expect(service.vote('a bad uuid', userId)).rejects.toThrowError(new PollAlreadyClosedException());
      expect(pollOptionSpy).toBeCalledWith({ optionId: 'a bad uuid' }, { relations: ['poll'] });
      expect(pollOptionSpy).toBeCalledTimes(1);
    });

    it('should throw already voted exception', async () => {
      jest.spyOn(redis as any, 'sismember').mockReturnValueOnce(1);
      expect(service.vote('a uuid', userId)).rejects.toThrowError(new PollAlreadyVotedException());
    });
  });
});
