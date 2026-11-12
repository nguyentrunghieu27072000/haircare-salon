import { buildBookingDays, formatPriceK, toSalonDateString } from './booking.service.js';

describe('booking helpers', () => {
  it('formats prices as thousands with a K suffix', () => {
    expect(formatPriceK(100000)).toBe('100K');
    expect(formatPriceK(1500000)).toBe('1500K');
  });

  it('uses the salon time zone for dates', () => {
    // 23:30 UTC on Nov 11 is already Nov 12 in Ho Chi Minh City (UTC+7).
    expect(toSalonDateString(new Date('2026-11-11T23:30:00Z'))).toBe('2026-11-12');
  });

  it('builds three consecutive days with midnight timestamps and labels', () => {
    const days = buildBookingDays(new Date('2026-11-11T23:30:00Z'));
    expect(days).toHaveLength(3);
    expect(days[0].label).toBe('Hôm nay, T5 (12/11)');
    expect(days[1].label).toBe('Ngày mai, T6 (13/11)');
    expect(days[2].label).toBe('Ngày kia, T7 (14/11)');
    expect(days[1].timestamp - days[0].timestamp).toBe(86_400);
    expect(new Date(days[0].timestamp * 1000).toISOString()).toBe('2026-11-11T17:00:00.000Z');
  });
});
