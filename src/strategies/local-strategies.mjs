import passport from "passport";
import { Strategy } from "passport-local";
import { UserLocalModel } from "../mongoose/schema/userSchema.mjs";
import { comparePassword } from "../bcrypt-password/cryptic.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await UserLocalModel.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await UserLocalModel.findOne({ username });
      if (!findUser) throw new Error("User not found");
      if (!comparePassword(password, findUser.password))
        throw new Error("Invalid Password");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
