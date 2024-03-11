import { Router } from "express";
import passport from "passport";
import { matchedData, checkSchema, validationResult } from "express-validator";
import { validatorSchema } from "../validators/validatorSchema.mjs";
import { hashPassword }from "../bcrypt-password/cryptic.mjs"
import { UserLocalModel } from "../mongoose/schema/userSchema.mjs";
// import "../strategies/local-strategies.mjs"
import '../strategies/discord_strategies.mjs'


const route = Router();


//esta ruta pide informacion sobre el usuario 
route.get("/api/userinfo", (request, response)=>{
    if (!request.user) return response.status(401).send(request.user);
    response.status(200).send(request.user);
})


// esta ruta crea al usuario 
route.post(
  "/api/newuser",
  checkSchema(validatorSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) return response.status(401).send(result.array());
    const data = matchedData(request);
    data.password = hashPassword(data.password);
    const newUSer = new UserLocalModel(data);
    try{
        const savedUser = await newUSer.save();
        response.status(200).send(savedUser)
    }catch(err){
        console.log(err);
        return response.sendStatus(400);
    }
  }
);

//esta ruta permite el acceso del usuario despues de haber sido creadso. passport.authenticate nunca puede
//ir en la ruta de la creacion del usuario
route.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.send(200);
});

//ruta para salir de la cuenta
route.post("/api/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logOut((err) => {
    if (err) {
      return response.status(401).send(err);
    } else {
      return response.status(200).send("You are logged out");
    }
  });
});
// esta route nos conduce a la pagina de identificacion proveida por discord 
route.get('/api/auth/discord', passport.authenticate('discord'))
// esta ruta, na vez idetificados nos redireccionara a esa ruta
route.get('/api/discord/redirect', passport.authenticate('discord'), (request, response)=>{
  response.sendStatus(200)
})


export default route;
