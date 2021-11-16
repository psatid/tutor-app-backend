import { ExpressRequest, ExpressResponse } from "../../types";
import * as admin from "firebase-admin";

export const firebaseAuth = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: () => void
): void | ExpressResponse => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        console.log(decodedToken);
        req.user = decodedToken;
        return next();
      })
      .catch((err) => {
        return res.status(403).json(err);
      });
  } else {
    return res.status(403).json({ error: "unauthorized" });
  }
};
