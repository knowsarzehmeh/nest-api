import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.userRepository.signUp(authCredentialDto);
  }

  async authenticateUser(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; payload: object }> {
    const payload: JwtPayload = await this.userRepository.authenticateUser(
      authCredentialDto,
    );
    const accessToken = await this.jwtService.sign(payload);

    return {
      accessToken,
      payload,
    };
  }
}
