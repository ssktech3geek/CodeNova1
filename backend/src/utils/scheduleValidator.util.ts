import { ItineraryItem, ConstraintCheckResult, ConstraintViolation, ScheduleSlot } from '../types';

// ============================================
// Schedule Validator
// Enforces Hard Constraints on Itinerary Items
// ============================================

const DEFAULT_TRANSIT_BUFFER_MINUTES = 15;

/**
 * Validate an entire itinerary's schedule for hard constraint violations.
 */
export function validateSchedule(
  items: ItineraryItem[],
  openingHours?: Record<string, { open: string; close: string } | null>
): ConstraintCheckResult {
  const violations: ConstraintViolation[] = [];
  const warnings: ConstraintViolation[] = [];

  // Sort items by start time
  const sorted = [...items].sort((a, b) => a.start_time.getTime() - b.start_time.getTime());

  // 1. Check for schedule overlaps
  const overlapViolations = checkScheduleOverlaps(sorted);
  violations.push(...overlapViolations);

  // 2. Check transit feasibility between consecutive items
  const transitViolations = checkTransitFeasibility(sorted);
  violations.push(...transitViolations);

  // 3. Check opening hours if provided
  if (openingHours) {
    const openingViolations = checkOpeningHours(sorted, openingHours);
    violations.push(...openingViolations);
  }

  return {
    is_feasible: violations.length === 0,
    violations,
    warnings,
  };
}

/**
 * Check if any two itinerary items overlap in time.
 */
export function checkScheduleOverlaps(items: ItineraryItem[]): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];

      // Skip if on different days (simple guard)
      if (a.day_number !== b.day_number) continue;

      if (a.start_time < b.end_time && a.end_time > b.start_time) {
        violations.push({
          type: 'SCHEDULE_OVERLAP',
          itemId: a.id,
          message: `"${a.title}" (${formatTime(a.start_time)}–${formatTime(a.end_time)}) overlaps with "${b.title}" (${formatTime(b.start_time)}–${formatTime(b.end_time)}).`,
          severity: 'ERROR',
        });
      }
    }
  }

  return violations;
}

/**
 * Check transit feasibility: item[i].end + buffer <= item[i+1].start
 */
export function checkTransitFeasibility(
  items: ItineraryItem[],
  bufferMinutes: number = DEFAULT_TRANSIT_BUFFER_MINUTES
): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];

  for (let i = 0; i < items.length - 1; i++) {
    const current = items[i];
    const next = items[i + 1];

    if (current.day_number !== next.day_number) continue;

    const endWithBuffer = new Date(current.end_time.getTime() + bufferMinutes * 60 * 1000);

    if (endWithBuffer > next.start_time) {
      const shortfall = Math.ceil(
        (endWithBuffer.getTime() - next.start_time.getTime()) / (60 * 1000)
      );
      violations.push({
        type: 'TRANSIT_INFEASIBLE',
        itemId: next.id,
        message: `Not enough transit time between "${current.title}" and "${next.title}". Need ${bufferMinutes} min buffer + travel, but only ${Math.max(0, shortfall - bufferMinutes)} min available.`,
        severity: 'ERROR',
      });
    }
  }

  return violations;
}

/**
 * Check that item times fall within vendor opening hours.
 */
export function checkOpeningHours(
  items: ItineraryItem[],
  openingHours: Record<string, { open: string; close: string } | null>
): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];

  for (const item of items) {
    const dayOfWeek = item.start_time.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const hours = openingHours[dayOfWeek];

    if (hours === null) {
      violations.push({
        type: 'OPENING_HOURS',
        itemId: item.id,
        message: `"${item.title}" is closed on ${dayOfWeek}.`,
        severity: 'ERROR',
      });
      continue;
    }

    if (!hours) continue; // No restriction defined

    const openTime = parseTime(item.start_time, hours.open);
    const closeTime = parseTime(item.start_time, hours.close);

    if (item.start_time < openTime || item.end_time > closeTime) {
      violations.push({
        type: 'OPENING_HOURS',
        itemId: item.id,
        message: `"${item.title}" scheduled ${formatTime(item.start_time)}–${formatTime(item.end_time)}, but opens ${hours.open}–${hours.close}.`,
        severity: 'ERROR',
      });
    }
  }

  return violations;
}

/**
 * Check if a proposed new item can be inserted without conflicts.
 */
export function canInsertItem(
  existingItems: ItineraryItem[],
  candidate: Pick<ItineraryItem, 'id' | 'start_time' | 'end_time' | 'day_number' | 'title'>
): boolean {
  const sameDay = existingItems.filter((i) => i.day_number === candidate.day_number);
  for (const existing of sameDay) {
    if (
      candidate.start_time < existing.end_time &&
      candidate.end_time > existing.start_time
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Extract free time slots on a given day from a list of items.
 */
export function extractFreeSlots(
  items: ItineraryItem[],
  dayNumber: number,
  dayStart: Date,
  dayEnd: Date
): Array<{ start: Date; end: Date; durationMinutes: number }> {
  const dayItems = items
    .filter((i) => i.day_number === dayNumber)
    .sort((a, b) => a.start_time.getTime() - b.start_time.getTime());

  const slots: Array<{ start: Date; end: Date; durationMinutes: number }> = [];
  let cursor = dayStart;

  for (const item of dayItems) {
    if (cursor < item.start_time) {
      const duration = Math.floor((item.start_time.getTime() - cursor.getTime()) / (60 * 1000));
      if (duration >= 30) {
        slots.push({ start: cursor, end: item.start_time, durationMinutes: duration });
      }
    }
    if (item.end_time > cursor) {
      cursor = item.end_time;
    }
  }

  // Remaining time at end of day
  if (cursor < dayEnd) {
    const duration = Math.floor((dayEnd.getTime() - cursor.getTime()) / (60 * 1000));
    if (duration >= 30) {
      slots.push({ start: cursor, end: dayEnd, durationMinutes: duration });
    }
  }

  return slots;
}

// ============================================
// Internal Helpers
// ============================================
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function parseTime(baseDate: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
}
