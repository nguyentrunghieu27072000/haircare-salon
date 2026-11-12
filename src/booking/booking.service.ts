import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export const SALON_TIME_ZONE = 'Asia/Ho_Chi_Minh';

/** Free extras the customer can tick when booking. */
export const FREE_SERVICES = [
  'Bỏ bớt thời gian gội, cắt sớm',
  'Da dễ kích ứng',
  'Hỏi kỹ trước khi cắt',
  'Hướng dẫn vuốt sáp tại nhà',
  'Tư vấn cắt tóc mới',
  'Cắt - giũa móng tay',
];

export interface BookingDay {
  /** Unix seconds at midnight (salon time zone) — what the page sends back. */
  timestamp: number;
  /** e.g. "Hôm nay, T4 (12/11)" */
  label: string;
}

/** What public/js/booking.js renders for each service. */
export interface ServiceOption {
  id: string;
  categoryId: string;
  multiSelect: boolean;
  name: string;
  description: string;
  /** Formatted for display, e.g. "100K". */
  price: string;
}

export interface NewBooking {
  serviceIds: string[];
  /** Unix seconds for the chosen day (one of BookingDay.timestamp). */
  date: number;
  /** "9h30" */
  time: string;
  freeServices: string[];
  consulting: boolean;
  photo: boolean;
  userId: string | null;
}

/** "YYYY-MM-DD" for the given instant in the salon's time zone. */
export function toSalonDateString(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: SALON_TIME_ZONE });
}

/** Builds the next `count` days starting today, shaped for the booking page. */
export function buildBookingDays(now = new Date(), count = 3): BookingDay[] {
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const relative = ['Hôm nay', 'Ngày mai', 'Ngày kia'];
  const days: BookingDay[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getTime() + i * 86_400_000);
    const ymd = toSalonDateString(d);
    const midnight = new Date(`${ymd}T00:00:00+07:00`);
    const [, month, day] = ymd.split('-');
    // Midnight in UTC+7 is 17:00 UTC of the previous day, hence the +1.
    const weekday = dayNames[(midnight.getUTCDay() + 1) % 7];
    days.push({
      timestamp: Math.floor(midnight.getTime() / 1000),
      label: `${relative[i] ?? ymd}, ${weekday} (${day}/${month})`,
    });
  }
  return days;
}

/** 100000 -> "100K" */
export function formatPriceK(price: number): string {
  return `${String(price).slice(0, -3)}K`;
}

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookingPageData() {
    console.log(111);
    const categoryList = await this.prisma.serviceCategory.findMany({
      orderBy: { order: 'asc' },
      include: { services: { orderBy: { price: 'asc' } } },
    });

    const categories: Record<string, string> = {};
    const servicesByCategory: Record<string, ServiceOption[]> = {};
    const serviceNames: Record<string, string> = {};
    for (const category of categoryList) {
      categories[category.id] = category.name;
      servicesByCategory[category.id] = category.services.map((s) => ({
        id: s.id,
        categoryId: category.id,
        multiSelect: category.multiSelect,
        name: s.name,
        description: s.description,
        price: formatPriceK(s.price),
      }));
      for (const s of category.services) serviceNames[s.id] = s.name;
    }

    const days = buildBookingDays();
    return {
      categories,
      servicesByCategory,
      serviceNames,
      days,
      firstDay: days[0],
      freeServices: FREE_SERVICES,
    };
  }

  /** Returns the id of the created booking, or null when no valid service was chosen. */
  async createBooking(input: NewBooking): Promise<string | null> {
    const chosen = await this.prisma.service.findMany({
      where: { id: { in: input.serviceIds } },
    });
    if (!chosen.length) return null;

    const ymd = toSalonDateString(new Date(input.date * 1000));
    const [hours, minutes] = input.time.replace('h', ':').split(':');
    const scheduledAt = new Date(
      `${ymd}T${hours.padStart(2, '0')}:${(minutes || '00').padStart(2, '0')}:00+07:00`,
    );

    const booking = await this.prisma.booking.create({
      data: {
        scheduledAt,
        total: chosen.reduce((sum, s) => sum + s.price, 0),
        savePhoto: input.photo,
        consulting: input.consulting,
        freeServices: input.freeServices,
        serviceIds: chosen.map((s) => s.id),
        userId: input.userId,
      },
    });
    return booking.id;
  }
}
