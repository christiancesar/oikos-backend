import { BusinessHourEntity, DayOfWeek } from "../entities/BusinessHour";
import { makeTimeSlot } from "./makeTimeSlot";

export function makeBusinessHoursDefault(): BusinessHourEntity[] {
  return [
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.MONDAY,
      timeSlots: [
        makeTimeSlot({
          startTime: "07:00",
          endTime: "11:00",
        }),
        makeTimeSlot({
          startTime: "13:00",
          endTime: "17:00",
        }),
      ],
    }),
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.TUESDAY,
      timeSlots: [
        makeTimeSlot({
          startTime: "07:00",
          endTime: "11:00",
        }),
        makeTimeSlot({
          startTime: "13:00",
          endTime: "17:00",
        }),
      ],
    }),
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.WEDNESDAY,
      timeSlots: [
        makeTimeSlot({
          startTime: "07:00",
          endTime: "11:00",
        }),
        makeTimeSlot({
          startTime: "13:00",
          endTime: "17:00",
        }),
      ],
    }),
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.THURSDAY,
      timeSlots: [
        makeTimeSlot({
          startTime: "07:00",
          endTime: "11:00",
        }),
        makeTimeSlot({
          startTime: "13:00",
          endTime: "17:00",
        }),
      ],
    }),
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.FRIDAY,
      timeSlots: [
        makeTimeSlot({
          startTime: "07:00",
          endTime: "11:00",
        }),
        makeTimeSlot({
          startTime: "13:00",
          endTime: "17:00",
        }),
      ],
    }),
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.SATURDAY,
      timeSlots: [],
    }),
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.SUNDAY,
      timeSlots: [],
    }),
  ];
}
