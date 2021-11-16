import firebase from "firebase";
import {
  ExpressRequest,
  ExpressResponse,
  Student,
  PostSignupRequestBody,
  Privilege,
  Tutor,
} from "../../types";
import { db } from "../../utils/admin";

export const postSignup = (
  req: ExpressRequest,
  res: ExpressResponse
): ExpressResponse | void => {
  let uid: string;
  let tokenID: string;
  let userInfo: Student | Tutor;
  const requestBody = req.body as PostSignupRequestBody;

  db.doc(`/students/${requestBody.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ error: "this username already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(
            requestBody.email,
            requestBody.password
          )
          .then((data) => {
            uid = data.user?.uid ?? "";
            return data.user?.getIdToken();
          })
          .then((token) => {
            tokenID = token ?? "";
            const studentInfo: Student = {
              name: requestBody.name,
              email: requestBody.email,
              uid,
              username: requestBody.username,
              privilege: Privilege.Student,
            };
            const tutorInfo: Tutor = {
              name: requestBody.name,
              email: requestBody.email,
              uid,
              username: requestBody.username,
              privilege: Privilege.Tutor,
            };

            userInfo =
              requestBody.privilege === Privilege.Student
                ? studentInfo
                : tutorInfo;
            const collection =
              requestBody.privilege === Privilege.Student
                ? "students"
                : "tutors";

            return db.doc(`/${collection}/${uid}`).set(userInfo);
          })
          .then(() => {
            return res
              .status(201)
              .json({ tokenID, privilege: userInfo.privilege });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: {
          code: err.code,
          message: err.message,
        },
      });
    });
};
