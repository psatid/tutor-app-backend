import {
  ExpressRequest,
  ExpressResponse,
  Tutor,
  Student,
  Privilege,
} from "../../types";
import { db } from "../../utils";

export const getCurrentUser = (
  req: ExpressRequest,
  res: ExpressResponse
): ExpressResponse | void => {
  let response: Tutor | Student;
  const privilege = req.params.privilege;
  const collection = privilege === Privilege.Student ? "students" : "tutors";

  db.collection(collection)
    .where("uid", "==", req.user?.uid)
    .limit(1)
    .get()
    .then((data) => {
      if (data.empty) {
        return res.status(404).json({ message: "user not found" });
      } else {
        data.forEach((doc) => {
          response =
            privilege === Privilege.Student
              ? (doc.data() as Student)
              : (doc.data() as Tutor);
        });
        return res.json(response);
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: {
          code: err.code,
          message: err.message,
        },
      });
    });
};
