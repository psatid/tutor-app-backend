import firebase from "firebase";
import {
  ExpressRequest,
  ExpressResponse,
  PostLoginRequestBody,
  Privilege,
} from "../../types";
import { db } from "../../utils";

export const postLogin = (
  req: ExpressRequest,
  res: ExpressResponse
): ExpressResponse | void => {
  const requestBody = req.body as PostLoginRequestBody;
  let privilege: Privilege;

  firebase
    .auth()
    .signInWithEmailAndPassword(requestBody.email, requestBody.password)
    .then((data) => {
      return data.user;
    })
    .then((user) => {
      db.collection("students")
        .where("uid", "==", user?.uid)
        .limit(1)
        .get()
        .then((data) => {
          if (data.empty) {
            privilege = Privilege.Tutor;
            return user?.getIdToken();
          } else {
            privilege = Privilege.Student;
            return user?.getIdToken();
          }
        })
        .then((token) => {
          return res.json({ token, privilege });
        });
    })
    .catch((err) => {
      console.error(err);
      const error = {
        code: err.code,
        message: err.message,
      };
      if (err.code === "auth/wrong-password") {
        return res.status(403).json({
          ...error,
          message: "wrong password",
        });
      } else if (err.code === "auth/user-not-found") {
        return res.status(404).json({ ...error, message: "user not found" });
      } else {
        return res.status(500).json(error);
      }
    });
};
