import trabajador from '../src/models/trabajador'
module.exports = (io) => {
  io.on('connection', (socket) => {


    const EmitirTrabajador = async () => {
        try{
            const Trabajador = await trabajador.find({ borrado: false })
                                                .populate('contratacion.departamento')
                                                .populate('contratacion.cargo')
                                                .populate('contratacion.de')
                                                .exec()
            io.emit('SERVER:Trabajador', Trabajador)
        }catch(err){
            console.log('Error en la emisión de los trabajadores:', err)
    }}

    socket.on('CLIENTE:Trabajador', async() => {
        try{
            EmitirTrabajador();
        }catch(err){
            console.log('Error no se pudo realizar la llamada a la emisión de trabajadores:', err)
        }
    })

    socket.on('CLIENTE:nuevoTrabajador', async (data) => {
        try{
            if(data._id){
                await trabajador.findByIdAndUpdate(data._id, data);
                EmitirTrabajador();
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó el trabajador', icon: 'info' });
                console.log('Se actualizó un trabajador');
                return
            }else{
                const Trabajador = new trabajador(data)
                try{
                    await Trabajador.save();
                    console.log('Se creó el registró nuevo trabajador');
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'se registó nuevo trabajador', icon: 'success' });
                    EmitirTrabajador();
                }catch(err){
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'No se pudo registrar el trabajador', icon: 'error' });
                    console.log('Error en el registro del trabajador', err)
                }
            }
        }catch(err){
            console.log('Error en el registro del trabajador:', err)
        }
    });

    socket.on('CLIENTE:EliminarTrabajador', async (data) => {
        try{
            await trabajador.findByIdAndUpdate(data._id, {borrado:true})
            try{
                EmitirTrabajador();
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó el trabajador', icon: 'info' });
            }catch(err){
                console.log(err)
            }
        }catch(err){
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en la eliminación del trabajador', icon: 'error' });
            console.log('Error en la eliminación del trabajador', err)
        }
    })


  })
}