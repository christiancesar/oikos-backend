import { randomUUID } from "crypto";

/**
 * Example of a class that represents a business hour entity.
  
  {
    dayOfWeek: "Monday"
        timeSlots: [
          { start: "07:00", end: "11:00" },
          { start: "13:00", end: "17:00" },
        ],
      }
    }
 */

export enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

type TimeSlot = {
  id: string;
  startTime: string; // Horário de início, formato "HH:mm"
  endTime: string; // Horário de fim, formato "HH:mm"
};

type BusinessHourEntityConstructor = {
  dayOfWeek: DayOfWeek;
  timeSlots: TimeSlot[]; // Um ou mais períodos no dia
};

export class BusinessHourEntity {
  id: string;
  dayOfWeek: string;
  timeSlots: TimeSlot[];

  constructor(
    { dayOfWeek, timeSlots }: BusinessHourEntityConstructor,
    id?: string,
  ) {
    this.id = id ?? randomUUID();
    this.dayOfWeek = DayOfWeek[dayOfWeek];
    this.timeSlots = timeSlots;
  }
}
