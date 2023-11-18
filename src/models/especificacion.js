const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let EspecificacionSchema = new Schema([{
    borrado:{
        type:Boolean,
        default:false,
    },
    viscosidad:{
        min:{type:Number},
        max:{type:Number},
        con:{type:String}
      },
      rigidez:{
        min:{type:Number},
        max:{type:Number},
        con:{type:String}
      },
      tack:{
        min:{type:Number},
        max:{type:Number},
        con:{type:String}
      },
      finura:{
        min:{type:Number},
        max:{type:Number},
        con:{type:String}
      },
      secado:{
        min:{type:Number},
        max:{type:Number},
        con:{type:String}
      }
}])

module.exports = mongoose.model('especificacion', EspecificacionSchema)