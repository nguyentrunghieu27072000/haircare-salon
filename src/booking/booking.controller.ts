import { BadRequestException, Body, Controller, Get, Post, Render, Session } from '@nestjs/common';
import { isObjectId } from '../common/object-id.pipe.js';
import type { AppSession } from '../common/session.js';
import { BookingService } from './booking.service.js';

interface CompleteBookingBody {
  'service-item'?: string | string[];
  date?: string;
  time?: string;
  'service-free'?: string;
  consulting?: string;
  photo?: string;
}

@Controller()
export class BookingController {
  constructor(private readonly booking: BookingService) {}

  @Get('/Booking')
  @Render('web/booking')
  index() {
    return this.booking.getBookingPageData();
  }

  @Post('/completebooking')
  async complete(@Body() body: CompleteBookingBody, @Session() session: AppSession) {
    const rawIds = body['service-item'];
    const serviceIds = (Array.isArray(rawIds) ? rawIds : rawIds ? [rawIds] : []).filter(isObjectId);
    const date = Number(body.date);
    const time = body.time?.trim() ?? '';

    if (!serviceIds.length || !Number.isFinite(date) || !/^\d{1,2}h\d{2}$/.test(time)) {
      throw new BadRequestException('Thiếu dịch vụ hoặc thời gian đặt lịch');
    }

    let freeServices: string[] = [];
    try {
      const parsed: unknown = JSON.parse(body['service-free'] ?? '[]');
      if (Array.isArray(parsed)) freeServices = parsed.map(String);
    } catch {
      freeServices = [];
    }

    const id = await this.booking.createBooking({
      serviceIds,
      date,
      time,
      freeServices,
      consulting: Boolean(body.consulting),
      photo: Boolean(body.photo),
      userId: session.userId ?? null,
    });
    if (!id) throw new BadRequestException('Dịch vụ không tồn tại');
    return { ok: true, id };
  }
}
