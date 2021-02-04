import { Test } from '@nestjs/testing';
import * as dayjs from 'dayjs';
import { PollFormatter } from './formatter/poll.formatter';
import { PollOption } from './poll-options.entity';
import { PollController } from './poll.controller';
import { Poll } from './poll.entity';
import { PollService } from './poll.service';

jest.mock('./poll.service.ts');

const userId = 'fake-user-id';
const testPollId = 'fake-poll-id';
const testPollTitle = 'Who is the best NBA player in history';
const testPollStartRange = [1613253120, 1614253120];
const testPollOptions = ['Michael Jordan', 'Kobe Bryant'];

describe('PollController', () => {
  let pollController: PollController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PollController],
      providers: [
        PollFormatter,
        PollService,
        {
          provide: PollService,
          useValue: {
            getPolls: jest.fn().mockImplementation(() => {
              return {
                items: [
                  {
                    pollId: testPollId,
                    creatorId: userId,
                    title: testPollTitle,
                    startAt: dayjs.unix(testPollStartRange[0]).toDate(),
                    endAt: dayjs.unix(testPollStartRange[1]).toDate(),
                    options: testPollOptions.map((text, idx) => ({
                      text,
                      optionId: idx,
                      pollId: testPollId,
                    })),
                  },
                  {
                    pollId: 'test poll 2',
                    creatorId: 'test user id',
                    title: 'testing poll',
                    startAt: dayjs.unix(testPollStartRange[0]).toDate(),
                    endAt: dayjs.unix(testPollStartRange[1]).toDate(),
                    options: ['test op1', 'test op2'].map((text, idx) => ({
                      text,
                      optionId: idx,
                      pollId: 'test poll 2',
                    })),
                  },
                ],
                meta: {
                  itemCount: 1,
                  totalItems: 1,
                  itemsPerPage: 30,
                  totalPages: 1,
                  currentPage: 1,
                },
              };
            }),
            createPoll: jest
              .fn()
              .mockImplementation((hkid: string, title: string, options: string[], startAt: number, endAt: number) => {
                const poll = new Poll();
                poll.pollId = testPollId;
                poll.creatorId = hkid;
                poll.title = title;
                poll.startAt = dayjs.unix(startAt).toDate();
                poll.endAt = dayjs.unix(endAt).toDate();
                poll.options = options.map((text) => {
                  const option = new PollOption();
                  option.pollId = hkid;
                  option.text = text;
                  return option;
                });
                return poll;
              }),
          },
        },
      ],
    }).compile();

    pollController = module.get<PollController>(PollController);
  });

  describe('createPoll', () => {
    it('should create a new poll', async () => {
      const createPollResult = await pollController.createPoll(userId, {
        title: testPollTitle,
        startAt: testPollStartRange[0],
        endAt: testPollStartRange[1],
        options: testPollOptions,
      });
      expect(createPollResult.startAt).toBe(testPollStartRange[0]);
      expect(createPollResult.endAt).toBe(testPollStartRange[1]);
      expect(createPollResult.title).toBe(testPollTitle);
      for (let i = 0; i < createPollResult.options.length; i++) {
        expect(createPollResult.options[i].text).toBe(testPollOptions[i]);
      }
    });

    it('should get an array of polls', async () => {
      const polls = await pollController.getPolls(userId, { page: 1 });
      expect(polls.items[0]).toEqual({
        id: testPollId,
        title: testPollTitle,
        startAt: testPollStartRange[0],
        endAt: testPollStartRange[1],
        options: testPollOptions.map((text, idx) => ({
          count: 0,
          optionId: idx,
          text: text,
        })),
      });
    });
  });
});
