import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { User } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const KEY_LENGTH = 64;

/** scrypt with a random salt; stored as "<salt-hex>:<hash-hex>". */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, KEY_LENGTH);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  register(phone: string, password: string): Promise<User> {
    return this.prisma.user.create({ data: { phone, passwordHash: hashPassword(password) } });
  }

  async login(phone: string, password: string): Promise<User | null> {
    const user = await this.findByPhone(phone);
    if (!user || !verifyPassword(password, user.passwordHash)) return null;
    return user;
  }
}
