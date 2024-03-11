import mongoose from "mongoose";

// esto es el esquema de informacion que mongodb seguira y del cual extraera informacion
const discorUserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    discordId:{
        type:String,
        required: true,
        unique:true
    }
})


export const DiscorModel = mongoose.model('DiscorModel', discorUserSchema)