import {Schema, model} from 'mongoose';

const grupoSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
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