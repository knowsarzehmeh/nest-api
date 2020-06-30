import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('UserRepository', () => {
  let repository;
  let mockCredentialDto: AuthCredentialDto;

  beforeEach(async () => {
    mockCredentialDto = {
      username: 'bode',
      password: 'Thomas123!',
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      repository.create = jest.fn().mockReturnValue({ save });
    });

    it('should successfully signup a user', () => {
      save.mockResolvedValue(undefined);
      expect(repository.signUp(mockCredentialDto)).resolves.not.toThrow();
    });

    it('should throw a conflict error exception as username already exist', () => {
      try {
        save.mockRejectedValue({ code: 23505 });
      } catch (error) {
        expect(repository.signUp(mockCredentialDto)).rejects.toThrow(
          ConflictException,
        );
      }
    });

    it('should throw an internal server error', () => {
      try {
        save.mockRejectedValue({ code: 2333343 });
      } catch (error) {
        expect(repository.signUp(mockCredentialDto)).rejects.toThrow(
          InternalServerErrorException,
        );
      }
    });
  });

  describe('authenticateUser | validateUserPassword', () => {
    let user;
    beforeEach(() => {
      repository.findOne = jest.fn();
      user = new User();
      user.username = 'testUsername';
      user.validatePassword = jest.fn();
    });

    it('should return username if password is valid', async () => {
      repository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);
      const result = await repository.authenticateUser(mockCredentialDto);
      expect(result).toEqual({ username: 'testUsername' });
    });

    it('should return null if user not found', () => {
      repository.findOne.mockResolvedValue(null);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(repository.authenticateUser(mockCredentialDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return null if password is invalid', () => {
      repository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(repository.authenticateUser(mockCredentialDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  //   describe('hashPassword', () => {
  //     it('should call bcrypt.hash to generate a hash', async () => {
  //       bcrypt.hash = jest.fn().mockResolvedValue('testHash');
  //       expect(bcrypt.hash).not.toHaveBeenCalled();
  //       const result = await repository.hashPassword('testPassword', 'testSalt');
  //       expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
  //       expect(result).toBe('testHash');
  //     });
  //   });
});
