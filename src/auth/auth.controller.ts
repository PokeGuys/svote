import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
    const { hkid } = authDto;
    const token = await this.authService.createToken(hkid);
    const refreshToken = await this.authService.createRefreshToken(hkid);
    return new AuthPayloadDto(token, refreshToken);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Exchange a refresh token for an access token' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: AuthPayloadDto,
    description: 'Return new access token and refresh token.',
  })
  @UseGuards()
  public async refreshToken(@Body() refreshDto: RefreshTokenDto) {
    const { refreshToken } = refreshDto;
    const { token, refreshToken: newRefreshToken } = await this.authService.createAccessTokenFromRefreshToken(
      refreshToken,
    );
    return new AuthPayloadDto(token, newRefreshToken);
  }
}
