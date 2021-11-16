import {
  ExpressRequest,
  ExpressResponse,
  StudentSchedule,
  TutorSchedule,
} from "../../types";
import * as admin from "firebase-admin";
import { db } from "../../utils/admin";

export const postScheduleBook = (
  req: ExpressRequest,
  res: ExpressResponse
): ExpressResponse | void => {
  if (req.user) {
    const studentScheduleInfo: StudentSchedule = {
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      tutorID: req.body.tutorID,
    };

    const tutorScheduleInfo: TutorSchedule = {
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      studentID: req.user.uid,
      studentName: req.body.studentName,
    };

    db.doc(`/students/${req.user?.uid}`)
      .get()
      .then((data) => {
        return data.ref.update({
          schedule: admin.firestore.FieldValue.arrayUnion(studentScheduleInfo),
        });
      })
      .then(() => {
        db.doc(`/tutors/${req.body.tutorID}`)
          .get()
          .then((data) => {
            return data.ref.update({
              schedule: admin.firestore.FieldValue.arrayUnion(
                tutorScheduleInfo
              ),
            });
          })
          .then(() => {
            return res.json({ message: "appointment booked successfully" });
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
