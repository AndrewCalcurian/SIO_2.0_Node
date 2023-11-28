const mongoose = require('mongoose');

const analisisSchema = new mongoose.Schema({
  cualitativo: {
    tono: Boolean,
    opacidad: Boolean,
    viscosidad: Boolean,
    secadoCapaFina: Boolean,
    secadoCapaGruesa: Boolean,
    brillo: Boolean
  },
  cuantitativo: {
    papel: Boolean,
    carton: Boolean,
    gramaje: String,
    calibre: String,
    muestra: String
  },
  carton: {
    estandar_1: {
      l: String,
      a: String,
      b: String
    },
    estandar_2: {
      l: String,
      a: String,
      b: String
    },
    estandar_3: {
      l: String,
      a: String,
      b: String
    },
    muestra_1: {
      l: String,
      a: String,
      b: String,
      ll: String,
      aa: String,
      bb: String,
      e: String
    },
    muestra_2: {
      l: String,
      a: String,
      b: String,
      ll: String,
      aa: String,
      bb: String,
      e: String
    },
    muestra_3: {
      l: String,
      a: String,
      b: String,
      ll: String,
      aa: String,
      bb: String,
      e: String
    }
  },
  papel: {
    estandar_1: {
      l: String,
      a: String,
      b: String
    },
    estandar_2: {
      l: String,
      a: String,
      b: String
    },
    estandar_3: {
      l: String,
      a: String,
      b: String
    },
    muestra_1: {
      l: String,
      a: String,
      b: String,
      ll: String,
      aa: String,
      bb: String,
      e: String
    },
    muestra_2: {
      l: String,
      a: String,
      b: String,
      ll: String,
      aa: String,
      bb: String,
      e: String
    },
    muestra_3: {
      l: String,
      a: String,
      b: String,
      ll: String,
      aa: String,
      bb: String,
      e: String
    }
  },
  muestra: {
    estandar_1: {
      l: String,
      a: String,
      b: String
    },
    estandar_2: {
      l: String,
      a: String,
      b: String
    },
    estandar_3: {
      l: String,
      a: String,
      b: String
    }
  }
});

module.exports = mongoose.model('AnalisisTinta', analisisSchema);