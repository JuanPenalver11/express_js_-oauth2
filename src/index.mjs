import express from "express";
import userRoute from "./routes/userRoute.mjs";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";


const app = express();

mongoose
  .connect("mongodb://localhost:27017/learning_dataBS")
  .then(() => console.log("Connected to dataBase"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser("holita"));
app.use(
  session({
    secret: "holi",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(userRoute);

app.get("/", (request, response) => {
  response.send("Holi");
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`PORT in ${PORT}`);
});
