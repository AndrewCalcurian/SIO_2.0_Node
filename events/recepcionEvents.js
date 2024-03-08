import Recepcion from '../src/models/recepcion'
module.exports = (io) => {
  io.on('connection', (socket) => {
    const emitirRecepciones = async () => {
      try {
        const Recepciones = await Recepcion.find({ borrado: false })
          .populate('materiales.material')
          .populate({
            path: 'materiales.material',
            populate: {
              path: 'fabricante'
            }
          })
          .populate({
            path: 'materiales.material',
            populate: {
              path: 'grupo'
            }
          })
          .populate({
            path: 'materiales.material',
            populate: {
              path: 'especificacion'
            }
          })
          .populate({
            path: 'materiales.material',
            populate: {
              path: 'especificacion2'
            }
          })
          .populate('proveedor')
          .exec()
        io.emit('SERVER:Recepciones', Recepciones)
      } catch (error) {
        console.error('Error al buscar recepciones:', error)
      }
    }
    socket.on('CLIENTE:BuscarRecepciones', async () => {
      try {
        await emitirRecepciones()
      } catch (err) {
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
    //***********************
    //* notificar recepcion *
    //***********************
    socket.on('CLIENTE:NotificaNuevoMaterial', async (id) => {
      try {
        await Recepcion.updateOne({ _id: id }, { status: 'Notificado' });
        console.log('Se realizo la notificacion de un material...')
      } catch (err) {
        console.log('ha ocurrido un error', err)
      }
      emitirRecepciones();
    })
    //cambiar a en observacion
    socket.on('CLIENTE:CheckeoDeMaterial', async (id) => {
      console.log(id);
      try {
        await Recepcion.updateOne({ _id: id }, { status: 'En observacion' });
        console.log('Se realizó el chequeo de la informacion');
      } catch (err) {
        console.log('error al checkear informacion', err)
      }
      emitirRecepciones();
    })

  })
}
