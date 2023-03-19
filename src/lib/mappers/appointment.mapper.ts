import { Appointment, EnrichedSlot } from '../internal-types';
import { DateUtils } from '../utils';

export function toAppointment(slot: EnrichedSlot): Appointment {
  return {
    date: DateUtils.toIsraelFormattedDate(slot.date),
    hour: DateUtils.timeSinceMidnightToHour(slot.timeSinceMidnight),
    city: slot.city,
    address: slot.address,
    branchName: slot.branchName
  };
}
