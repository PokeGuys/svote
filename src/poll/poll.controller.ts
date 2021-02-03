import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import dayjs from 'dayjs';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollsQueryDto } from './dto/polls-query.dto';
import { PollListResponseDto } from './dto/response/poll-list-response.dto';
import { VoteDto } from './dto/vote.dto';
import { PollFormatter } from './formatter/poll.formatter';
import { PollService } from './poll.service';

@ApiTags('poll')
@Controller('polls')
export class PollController {
  constructor(private readonly pollService: PollService, private readonly pollFormatter: PollFormatter) {}

  @Post()
  @ApiOperation({ summary: 'Create poll' })
  @ApiCreatedResponse({
    description: 'The poll has been successfully created.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation failed.',
  })
  public async createPoll(@Body() createPollDto: CreatePollDto) {
    const { hkid, title, options, startAt, endAt } = createPollDto;
    const poll = await this.pollService.createPoll(hkid, title, options, startAt, endAt);
    return this.pollFormatter.toJson(poll);
  }

  @Get()
  @ApiOperation({ summary: 'Get active poll list' })
  @ApiOkResponse({
    description: 'Return all active polls.',
    type: () => PollListResponseDto,
  })
  public async getPolls(@Query() query: PollsQueryDto) {
    const polls = await this.pollService.getPolls(query.cursor);
    const result = polls.map(this.pollFormatter.toJson);
    const cursor = polls.length > 0 ? dayjs(polls[polls.length - 1].createdAt).unix() : null;
    return {
      items: result,
      cursor,
    };
  }

  @Post(':pollOptionId/vote')
  @ApiOperation({ summary: 'Vote for a poll' })
  @ApiCreatedResponse({
    description: 'Vote successfully.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation failed.',
  })
  public async voteCampaign(@Param('pollOptionId') pollOptionId: string, @Body() voteDto: VoteDto) {
    await this.pollService.vote(pollOptionId, voteDto.hkid);
  }
}
