import * as functions from "firebase-functions";
import * as express from "express";
import firebase from "firebase";
import { firebaseConfig } from "./config";
import { postLogin, postSignup, firebaseAuth } from "./handler/authorization";
import { getAllStudents, getCurrentUser } from "./handler/users";
import { postScheduleBook, postScheduleCancel } from "./handler/schedule";

firebase.initializeApp(firebaseConfig);
const app = express();

app.get("/users", firebaseAuth, getAllStudents);

// authentication route
app.post("/signup", postSignup);
app.post("/login", postLogin);

// user routes
app.get("/users/:privilege/current", firebaseAuth, getCurrentUser);

// scheduling routes
app.post("/schedule/book", firebaseAuth, postScheduleBook);
app.post("/schedule/cancel", firebaseAuth, postScheduleCancel);

export const api = functions.https.onRequest(app);
