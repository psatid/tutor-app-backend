import { db } from "../../utils/admin";
import { ExpressRequest, ExpressResponse, Student } from "../../types";

export const getAllStudents = (
  req: ExpressRequest,
  res: ExpressResponse
): ExpressResponse | void => {
  db.collection("students")
    .get()
    .then((data) => {
      const users: Student[] = [];
      data.forEach((doc) => {
        const user: Student = {
          name: doc.data().name,
          hoursLeft: doc.data().hoursLeft,
          schedule: {
            startTime: doc.data().schedule?.startTime.toDate(),
            endTime: doc.data().schedule?.endTime.toDate(),
            tutorID: doc.data().schedule?.tutorID,
          },
          uid: doc.id,
          username: doc.data().username,
          email: doc.data().email,
          privilege: doc.data().privilege,
        };
        users.push(user);
      });
      return res.json(users);
    })
    .catch((err) => console.error({ error: err.message }));
};
