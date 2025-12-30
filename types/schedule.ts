// types/schedule.ts

export interface Schedule {
  date: string;
  fullDate: string;
  conductor: string;
  topic: string;
  prayer: string;
}

export interface AllSchedules {
  [key: string]: Schedule[];
}