import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

jest.mock('./auth.service.ts');

const testToken = 'fake-token';
const testHKID = 'U5849818';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            createToken: jest.fn().mockReturnValue(testToken),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('authenticate', () => {
    it('should create an access token', async () => {
      const createTokenResult = await authController.authenticate({
        hkid: testHKID,
      });
      expect(createTokenResult.token).toEqual(testToken);
    });
  });
});
