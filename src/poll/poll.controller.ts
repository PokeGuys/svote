import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { CreatePollDto } from './dto/create-poll.dto';
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
}
