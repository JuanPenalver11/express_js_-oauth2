import passport from "passport";
import Strategy from "passport-discord";
import { CLIENT_ID } from "../env/client.mjs";
import { CLIENT_SECRET } from "../env/client.mjs";
import { DiscorModel } from "../mongoose/schema/discordUser.mjs";

passport.serializeUser((user, done)=>{
    done(null, user.id)
});

passport.deserializeUser( async (id, done)=>{
    try{
        const findUser = await DiscorModel.findById(id);
        if(!findUser) throw new Error ("User not found");
        done(null, findUser)
    }catch(err){
        done(err, null)
    }
})

export default passport.use(
  new Strategy(
    {
      clientID: CLIENT_ID, 
      clientSecret: CLIENT_SECRET,
      callbackURL: // calback una vez identificados con discord nos reconducira a esta url
        "https://l4rnrz4l-3000.asse.devtunnels.ms/api/discord/redirect",
      scope: ["identify"], // es el tipo de informacion que discord tiene que comprobar puede ser email, 
      // idetify, guilds hay muchos todas aparecen en el la pagina de discorsd 
    },
    // fijamos la estrategia. buscamos al usuario,
    async (accessToken, refreshToken, profile, done) => {
      let findUser;
      try {
        findUser = await DiscorModel.findOne({ discordId: profile.id });
      } catch (err) {
        return done(err, null);
      }
      // si el usuarion no existe creemos uno 
      try {
        if (!findUser) {
          const newUser = new DiscorModel({
            username: profile.username,
            discordId: profile.id,
          });
          //guardemoslo en la lista de usuarios 
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        //si ya exite entonces muestralo
        return done(null, findUser);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
