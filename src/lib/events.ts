import { getPayloadClient } from './payload'

// Seats still free for an event, or null when it has no capacity limit.
export async function seatsLeft(eventId: number, capacity: number | null | undefined): Promise<number | null> {
  if (!capacity) return null
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'event-registrations',
    where: { event: { equals: eventId } },
    pagination: false,
    depth: 0,
    select: { attendants: true },
    overrideAccess: true,
  })
  const taken = docs.reduce((sum, registration) => sum + (registration.attendants ?? 1), 0)
  return Math.max(0, capacity - taken)
}
