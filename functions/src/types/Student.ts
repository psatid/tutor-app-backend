import { Privilege } from "./Privilege";

export interface StudentSchedule {
  startTime: Date;
  endTime: Date;
  tutorID: string;
}

export interface Student {
  schedule?: StudentSchedule;
  hoursLeft?: number;
  name: string;
  uid: string;
  username: string;
  email: string;
  privilege: Privilege;
}
