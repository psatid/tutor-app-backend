import { StudentSchedule, Student } from "./Student";

export interface TutorSchedule extends Omit<StudentSchedule, "tutorID"> {
  studentID: string;
  studentName: string;
}

export interface Tutor extends Omit<Student, "hoursLeft" | "schedule"> {
  schedule?: TutorSchedule;
}
