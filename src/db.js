import {connect} from 'mongoose'
import {MONGODB_URI} from './config'

export const connectDB = async () => {
    try {
        await connect('mongodb+srv://admin:A25235074c@siodb.ulos1mo.mongodb.net/');
        console.log("connected to DB");
    } catch (error) {
        console.log(error);
    }
}