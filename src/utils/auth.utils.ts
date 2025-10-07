import * as crypto from 'crypto';

export const generateTemporaryPassword = () => {
  return crypto.randomBytes(4).toString('hex');
};
