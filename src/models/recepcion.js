const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RecepcionSchema = new Schema([{
    borrado:{
        type:Boolean,
        default:false,
    },
    status:{
        type:String,
        default:'Por notificar'
    },
    OC:{
        type:String,
        required:[true, 'Debes indicar una orden de compra']
    },
    cantidad:{
        type:String,
        required:[true, 'Debe indicar una cantidad total recepcionada']
    },
    documento:{
        type:String,
        required:[true, 'Debes ingresar un documento']
    },
    fabricacion:{
        type:String,
        required:[true, 'Debes indicar una fecha de fabricación']
    },
    materiales:[{
        presentacion:{type:String},
        neto:{type:String},
        lote:{type:String},
        unidad:{type:String},
        material:{
            type:Schema.Types.ObjectId,
            ref: 'material'
        },
    }],
    proveedor:{
        type:Schema.Types.ObjectId,
        ref: 'proveedor'
    },
    recepcion:{
        type:String,
        required:[true, 'Debes indicar una recepción']
    },
    transportista:{
        type:String,
        required:[true, 'Debes ingresar un transportista']
    }

}])

module.exports = mongoose.model('recepcion', RecepcionSchema)