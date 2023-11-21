const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let AlmacenSchema = new Schema([{

    borrado:{
        type:Boolean,
        default:false,
    },
    codigo:{
        type:Number
    },
    fabricacion:{
        type:String
    },
    lote:{
        type:String
    },
    material:{
        type:Schema.Types.ObjectId,
        ref: 'material'
    },
    neto:{
        type:String
    },
    presentacion:{
        type:String
    },
    recepcion:{
        type:Schema.Types.ObjectId,
        ref: 'recepcion'
    },
    unidad:{
        type:String
    }
}])

module.exports = mongoose.model('almacen', AlmacenSchema)
