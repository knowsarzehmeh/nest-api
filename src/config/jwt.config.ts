import { JwtModuleOptions } from '@nestjs/jwt';
import * as config from 'config';

const jwtAuthConfig = config.get('jwt');

const { secret, issuer, expiresIn } = jwtAuthConfig;

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || secret,
  signOptions: {
    expiresIn,
    issuer,
  },
};
