import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt-strategy';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { async } from 'rxjs/internal/scheduler/async';

const mockRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockRepository },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('should validate login with accessToken', async () => {
      const user = new User();
      user.username = 'TestUser';

      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: 'TestUser' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: 'TestUser',
      });
    });

    it('throws an unauthorized if user not found', () => {});
  });
});
