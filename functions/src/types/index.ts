import * as express from "express";
import * as admin from "firebase-admin";

export type ExpressResponse = express.Response;
export interface ExpressRequest extends express.Request {
  user?: admin.auth.DecodedIdToken;
}

export * from "./PostSignupRequestBody";
export * from "./PostLoginRequestBody";
export * from "./Privilege";
export * from "./Tutor";
export * from "./Student";
export * from "./PostScheduleBookRequestBody";
export * from "./PostScheduleCancelRequestBody";
