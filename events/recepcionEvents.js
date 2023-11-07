import Recepcion from '../src/models/recepcion'
module.exports = (io)=>{
    io.on('connection', (socket) => {
        const emitirRecepciones = async () =>{
            try {
                const Recepciones = await Recepcion.find({borrado:false})
                                                .populate('materiales.material')
                                                .populate({
                                                    path: 'materiales.material',
                                                    populate: {
                                                        path: 'fabricante'
                                                    }
                                                })
                                                .populate('proveedor')
                                                .exec()
                io.emit('SERVER:Recepciones', Recepciones)
            } catch (error) {
                console.error('Error al buscar recepciones:', error)
            }
        }
        socket.on('CLIENTE:BuscarRecepciones', async() => {
            try{
                await emitirRecepciones()
            }catch(err){
                console.error('No se pudo realizar la busqueda de las recepciones', err)
            }
        })
        // *******************
        // * NUEVA RECEPCIÓN *
        // *******************

        socket.on('CLIENTE:NuevaRecepcion', async (data) => {
                        
              // Verificar si los datos requeridos están completos
              
                const NuevaRecepcion = new Recepcion(data);
                try {
                  await NuevaRecepcion.save();
                  console.log('Se realizó nueva recepción de materiales');
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó nueva recepción de materiales', icon: 'success' });
                  emitirRecepciones();
                } catch (err) {
                  console.error('Hubo un error en la recepción de materiales:', err);
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la recepción de materiales', icon: 'error' });
                }         
          });
    })
}