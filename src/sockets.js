import Material  from './models/material';

export default (io) => {

    io.on('connection', (socket) =>{  
        // *******************
        // * BUSCAR MATERIAL *
        // *******************
        const EmitirMateriales = async () =>{
            const Materiales = await Material.find({borrado:false}).populate('fabricante').exec();
            io.emit('SERVER:Materiales', Materiales)
        }

        socket.on('CLIENTE:BuscarMaterial', async()=>{
            await EmitirMateriales();
        })

        // ******************
        // * NUEVO MATERIAL *
        // ******************
        // este código escucha el evento 'CLIENTE:NuevoMaterial' en un socket. 
        // Cuando se activa este evento, crea un nuevo objeto Material con los datos recibidos, 
        // lo guarda en la base de datos y luego emite una actualización de materiales.
        socket.on('CLIENTE:NuevoMaterial', async(data) =>{
            const NuevoMaterial = new Material(data);
            const NuevoMaterial_ = await NuevoMaterial.save()
                .then((data)=>{
                    console.log('se registró un nuevo material')
                })
                .catch((err)=>{
                    console.log('no se pudo registrar material')
                })
            await EmitirMateriales();
        })

        socket.on('CLIENTE:GuardarMaterial', async(data)=>{
            let id = data._id;
            delete data._id
            await Material.updateOne({_id:id})
        })
    });
};