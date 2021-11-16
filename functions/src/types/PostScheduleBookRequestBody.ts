export interface PostScheduleBookRequestBody {
  startTime: Date;
  endTime: Date;
  tutorID: string;
  studentName: string;
  studentID?: string;
}
