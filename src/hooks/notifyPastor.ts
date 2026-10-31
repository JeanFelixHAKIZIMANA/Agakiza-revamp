import type { Payload } from 'payload'

import type { Booking } from '@/payload-types'

// Sends the pastor a real-time alert for a new booking.
// Phase 3 replaces this with a WhatsApp Cloud API message carrying
// Approve / Reject buttons; until then it only records the event.
export async function notifyPastor(payload: Payload, booking: Booking): Promise<void> {
  payload.logger.info(
    { bookingId: booking.id, type: booking.type, phone: booking.phone },
    'New booking awaiting approval',
  )
}
