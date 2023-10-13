import {Schema, model} from 'mongoose';

const grupoSchema = new Schema({
    nombre:{
        type:String
    },
    parcial:{
        type:Boolean
    },
    icono:{
        type:String,
    },
},{
    timestamps:true
})

export default model('Grupo', grupoSchema)