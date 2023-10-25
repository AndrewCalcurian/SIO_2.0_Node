import Grupo from '../src/models/grupo';
module.exports = (io) => {

    io.on('connection', (socket) => {
        // crear funcion para emitir grupos
        const emitGrupos = async () =>{
            try {
                const Grupos = await Grupo.find({borrado:false})
                io.emit('cargarGrupos', Grupos)
            } catch (error) {
                console.error('Error al buscar grupos:', error)
            }
            
        }
        
        // EVENTOS CRUD DE GRUPOS

        // ****************
        // * BUSCAR GRUPO *
        // ****************
        socket.on('CLIENTE:buscarGrupos', async () =>{
            try {
                emitGrupos()
            } catch (error) {
                console.error('Error al emitir grupos:', error)
            }
            
        });

        // ***************
        // * NUEVO GRUPO *
        // ***************
        socket.on('CLIENTE:NuevoGrupo', async (data) => {
            const NuevaNota = new Grupo(data);
            const nuevaNota_ = await NuevaNota.save()
                .then(()=>{
                    console.log('Se creo un nuevo grupo')
                }).catch((err)=>{
                    console.error('hubo un error en la creación del grupo:', err)
                })
                emitGrupos()
        });

        // ******************
        // * Eliminar GRUPO *
        // ******************
        socket.on('CLIENTE:deleteGrupo', async (id) => {
            await Grupo.updateOne({_id:id}, {borrado:true})
                .then(()=>{
                    console.log('Se eliminó un grupo')
                }).catch((err)=>{
                    console.error('Hubo un error en la eliminación del grupo:', err)
                })
            emitGrupos()
        });

        // ****************
        // * EDITAR GRUPO *
        // ****************
        socket.on('CLIENTE:EditarGrupo', async (data) => {
            try{
                await Grupo.findByIdAndUpdate(data.id, data)
                console.log('Se editó un grupo')
            } catch(err) {
                console.error('Error al editar grupo: ', err)
            }
            
            emitGrupos()
        });

    })

};