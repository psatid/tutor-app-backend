import {
  ExpressRequest,
  ExpressResponse,
  StudentSchedule,
  TutorSchedule,
  PostScheduleCancelRequestBody,
} from "../../types";
import { db } from "../../utils";
import * as admin from "firebase-admin";

export const postScheduleCancel = (
  req: ExpressRequest,
  res: ExpressResponse
): ExpressResponse | void => {
  if (req.user) {
    const requestBody = req.body as PostScheduleCancelRequestBody;

    const studentScheduleInfo: StudentSchedule = {
      startTime: requestBody.startTime,
      endTime: requestBody.endTime,
      tutorID: requestBody.tutorID,
    };

    // provide student ID in request body when tutor cancel schedule
    const tutorScheduleInfo: TutorSchedule = {
      startTime: requestBody.startTime,
      endTime: requestBody.endTime,
      studentID: requestBody.studentID ?? req.user.uid,
      studentName: requestBody.studentName,
    };

    db.doc(`/students/${req.user?.uid}`)
      .get()
      .then((data) => {
        return data.ref.update({
          schedule: admin.firestore.FieldValue.arrayRemove(studentScheduleInfo),
        });
      })
      .then(() => {
        db.doc(`/tutors/${req.body.tutorID}`)
          .get()
          .then((data) => {
            return data.ref.update({
              schedule: admin.firestore.FieldValue.arrayRemove(
                tutorScheduleInfo
              ),
            });
          })
          .then(() => {
            return res.json({ message: "appointment cancelled successfully" });
          })
          .catch((err) => {
            return res.status(500).json({
              error: {
                code: err.code,
                message: err.message,
              },
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          error: {
            code: err.code,
            message: err.message,
          },
        });
      });
  } else {
    return res.status(403).json({ error: "unauthorized" });
  }
};
