import { BusinessHourEntity, DayOfWeek } from "../entities/BusinessHour";

export function makeBusinessHoursDefault(): BusinessHourEntity[] {
  return [
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.MONDAY,
      timeSlots: [
        {
          startTime: "07:00",
          endTime: "11:00",
        },
        {
          startTime: "13:00",
          endTime: "17:00",
        },
      ],
    }),
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.TUESDAY,
      timeSlots: [
        {
          startTime: "07:00",
          endTime: "11:00",
        },
        {
          startTime: "13:00",
          endTime: "17:00",
        },
      ],
    }),
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.WEDNESDAY,
      timeSlots: [
        {
          startTime: "07:00",
          endTime: "11:00",
        },
        {
          startTime: "13:00",
          endTime: "17:00",
        },
      ],
    }),
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.THURSDAY,
      timeSlots: [
        {
          startTime: "07:00",
          endTime: "11:00",
        },
        {
          startTime: "13:00",
          endTime: "17:00",
        },
      ],
    }),
    new BusinessHourEntity({
      dayOfWeek: DayOfWeek.FRIDAY,
      timeSlots: [
        {
          startTime: "07:00",
          endTime: "11:00",
        },
        {
          startTime: "13:00",
          endTime: "17:00",
        },
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
