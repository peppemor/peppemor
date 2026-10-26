import { randomBytes } from 'node:crypto';

let developmentSecret: string | undefined;

export const getAuthSecret = (): string => {
  if (process.env.NODE_ENV === 'production') {
    const productionSecret = process.env.JWT_SECRET;
    if (!productionSecret) {
      throw new Error('JWT secret missing: set JWT_SECRET in environment');
    }
    return productionSecret;
  }

  developmentSecret ??= randomBytes(32).toString('base64url');
  return developmentSecret;
};