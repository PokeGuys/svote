import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserId } from '../app/decorator/user-id.decorator';
import { AuthGuard } from '../app/guards/auth.guard';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollsQueryDto } from './dto/polls-query.dto';
import { PollListResponseDto } from './dto/response/poll-list-response.dto';
import { PollResponseDto } from './dto/response/poll-response.dto';
import { PollFormatter } from './formatter/poll.formatter';
import { PollService } from './poll.service';

@ApiTags('poll')
@ApiBearerAuth()
@Controller('polls')
@UseGuards(AuthGuard)
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
  public async createPoll(@UserId() userId: string, @Body() createPollDto: CreatePollDto) {
    const { title, options, startAt, endAt } = createPollDto;
    const poll = await this.pollService.createPoll(userId, title, options, startAt, endAt);
    return this.pollFormatter.toJson(poll);
  }

  @Get()
  @ApiOperation({ summary: 'Get active poll list' })
  @ApiOkResponse({
    description: 'Return all active polls.',
    type: () => PollListResponseDto,
  })
  public async getPolls(@UserId() userId: string, @Query() query: PollsQueryDto) {
    const polls = await this.pollService.getPolls(query.page ?? 1, userId);
    const items = polls.items.map(this.pollFormatter.toJson);
    return {
      items,
      meta: polls.meta,
    };
  }

  @Get(':pollId')
  @ApiOperation({ summary: 'Get poll detail' })
  @ApiOkResponse({
    description: 'Return an active polls.',
    type: () => PollResponseDto,
  })
  public async getPoll(@UserId() userId: string, @Param('pollId') pollId: string) {
    const poll = await this.pollService.getPoll(pollId, userId);
    return this.pollFormatter.toJson(poll);
  }

  @Post(':pollOptionId/vote')
  @ApiOperation({ summary: 'Vote for a poll' })
  @ApiCreatedResponse({
    description: 'Vote successfully.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation failed.',
  })
  public async voteCampaign(@Param('pollOptionId') pollOptionId: string, @UserId() userId: string) {
    const voteResult = await this.pollService.vote(pollOptionId, userId);
    const poll = await this.pollService.getPoll(voteResult.pollId, userId);
    return this.pollFormatter.toJson(poll);
  }
}
