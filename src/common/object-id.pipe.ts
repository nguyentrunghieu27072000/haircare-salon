import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';

export const OBJECT_ID_RE = /^[0-9a-f]{24}$/i;

export function isObjectId(value: unknown): value is string {
  return typeof value === 'string' && OBJECT_ID_RE.test(value);
}

/** Rejects ids that cannot be a MongoDB ObjectId before they reach Prisma. */
@Injectable()
export class ObjectIdPipe implements PipeTransform<unknown, string> {
  transform(value: unknown): string {
    if (!isObjectId(value)) throw new NotFoundException('Không tìm thấy');
    return value;
  }
}
