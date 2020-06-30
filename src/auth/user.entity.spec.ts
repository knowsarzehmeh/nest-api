import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
describe('UserEntity', () => {
  let user: User;
  beforeEach(() => {
    user = new User();
    user.salt = 'testSalt';
    user.password = 'testPassword';
    // bcrypt.compare = jest.fn();
  });
  describe('validatePassword', () => {
    // it('should return true if password is valid', () => {
    //   bcrypt.compare.mockResovledValue(true);
    // });

    it('should return false if password is invalid', () => {});
  });
});
