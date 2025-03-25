import { TimeSlot } from "../entities/BusinessHour";

type TimeSlotParams = {
  startTime?: string;
  endTime?: string;
};
export function makeTimeSlot(raw: TimeSlotParams): TimeSlot {
  return new TimeSlot({
    startTime: raw.startTime ? raw.startTime : "07:00",
    endTime: raw.endTime ? raw.endTime : "11:00",
  });
}
