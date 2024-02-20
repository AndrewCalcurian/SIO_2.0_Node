import {Schema, model} from 'mongoose';

const AnalisisSchema = new Schema({
    especificacion: {
        type: Map,
        of: String
    }
});

export default model('prueba', AnalisisSchema)