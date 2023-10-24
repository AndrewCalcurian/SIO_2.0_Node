const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProveedorSchema = new Schema([{
    borrado:{
        type:Boolean,
        default:false,
    },
    nombre:{
        type:String,
        required:true
    },
    direccion:{
        type:String,
    },
    rif:{
        type:String,
    },
    contactos:{
        type:Array,
    },
    fabricantes:{
        type:Schema.Types.ObjectId,
        ref: 'fabricante'
    }

}])

module.exports = mongoose.model('proveedor', ProveedorSchema)