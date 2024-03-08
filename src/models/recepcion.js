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
    cantidad:[{
        type:String,
        required:[true, 'Debe indicar una cantidad total recepcionada']
    }],
    documento:{
        type:String,
        required:[true, 'Debes ingresar un documento']
    },
    fabricacion:[{
        type:String,
    }],
    materiales:[[{
        analisis:{type:String},
        codigo:{type:Number},
        presentacion:{type:String},
        neto:{type:String},
        lote:{type:String},
        unidad:{type:String},
        fabricacion:{type:String},
        ancho:{type:Number},
        largo:{type:Number},
        material:{
            type:Schema.Types.ObjectId,
            ref: 'material'
        },
    }]],
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
    },
    condicion:[{
        Certificado_de_calidad:{type:Boolean},
        Identificacion_del_lote:{type:Boolean},
        Cajas_en_buen_estado:{type:Boolean},
        Cajas_limpias:{type:Boolean},
        Envases_cerrado_hermeticamente:{type:Boolean}
    }],

}],{
    timestamps:true
  })

module.exports = mongoose.model('recepcion', RecepcionSchema)