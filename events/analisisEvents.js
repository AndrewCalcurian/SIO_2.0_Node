import AnalisisTinta from "../src/models/analisis-tinta"
module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('CLIENTE:NuevoAnalisis', async (data) => {
            // Verificar si los datos requeridos están completos
            const NuevoAnalisis = new AnalisisTinta(data);
            const doc = await AnalisisTinta.findOne({ _id: data._id });
            if (doc) {
              // Document already exists
              return res.status(400).send('Document already exists');
            }
            try {
              await NuevoAnalisis.save();
              console.log('Se realizó nuevo analisis');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó nuevo analisis', icon: 'success' });
              emitirRecepciones();
            } catch (err) {
              console.error('Hubo un error en el registro del analisis:', err);
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en el registro del analisis', icon: 'error' });
            }
          });
    })  
}