import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'User authentication' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: AuthPayloadDto,
    description: 'Return JWT access token with an hour expiration.',
  })
  public async authenticate(@Body() authDto: AuthDto) {
    const token = await this.authService.createToken(authDto.hkid);
    return new AuthPayloadDto(token);
  }
}
