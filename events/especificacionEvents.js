import especificacion from "../src/models/especificacion"
import Material from "../src/models/material"

module.exports = (io) => {
  io.on('connection', (socket) => {
    const emitirEspecificaciones = async () => {
      try {
        const Especificaciones = await especificacion.find({ borrado: false }).exec()
        io.emit('SERVER:Especificaciones', Especificaciones)
      } catch (error) {
        console.error('Error al buscar especificaciones:', error)
      }
    }

    socket.on('CLIENTE:BuscarEspecificaciones', async () => {
      try {
        await emitirEspecificaciones()
      } catch (err) {
        console.error('No se pudo realizar la busqueda de las especificaciones', err)
      }
    })

    //Nueva especificacion
    socket.on('CLIENTE:nuevaEspecificacion', async (data) => {
      try {
        const nuevaEspecificacion = await especificacion.create(data.especificacion);
        console.log('Se creo una nueva especificacion');
        const Mat = await Material.findByIdAndUpdate(data.material, { especificacion: nuevaEspecificacion._id })
        console.log('Se actualizo el material')
        const materials = await Material.find({ borrado: false }).populate('fabricante').populate('especificacion');
        socket.emit('SERVER:Materiales', materials);
      } catch (err) {
        console.error('Ha ocurrido un error en la creacion de la especificacion', err);
      }
      await emitirEspecificaciones()
    })
    //Edicion de especificacion
    socket.on('CLIENTE:EdicionEspecificacion', async (data) => {
      try {
        await especificacion.findByIdAndUpdate(data._id, data);
        console.log('Se edito la especificacion');
      } catch (err) {
        console.error('Ha ocurrido un error en la edicion de la especificacion', err)
      }
      await emitirEspecificaciones()
    })
  })
}
