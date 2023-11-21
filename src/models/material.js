const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MaterialSchema = new Schema([{
    borrado:{
        type:Boolean,
        default:false,
    },
    calibre:{
        type:String,
    },
    codigo:{
        type:String,
    },
    color:{
        type:String,
    },
    fabricante:{
        type:Schema.Types.ObjectId,
        ref: 'fabricante'
    },
    gramaje:{
        type:String,
    },
    grupo:{
        type:Schema.Types.ObjectId,
        ref: 'grupo'
    },
    nombre:{
        type:String,
    },
    origen:{
        type:String,
    },
    serie:{
        type:String,
    },
    especificacion:{
        type:Schema.Types.ObjectId,
        ref: 'especificacion'
    }

}])

module.exports = mongoose.model('material', MaterialSchema)