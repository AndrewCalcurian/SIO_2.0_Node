import Grupo from './models/grupo';
import Fabricante from './models/fabricante'
import Proveedor from './models/proveedor'
export default (io) => {

    io.on('connection', (socket) =>{  
        
        const emitGrupos = async () =>{
            console.log('alguien Nuevo se conectó')
            const Grupos = await Grupo.find({borrado:false})
            io.emit('cargarGrupos', Grupos)
        }
        emitGrupos()
        // ****************
        // * BUSCAR GRUPO *
        // ****************
        socket.on('CLIENTE:buscarGrupos', async () =>{
            const Grupos = await Grupo.find({borrado:false})
            io.emit('cargarGrupos', Grupos)
        })


        // ***************
        // * NUEVO GRUPO *
        // ***************

        socket.on('CLIENTE:NuevoGrupo', async (data) => {
            const NuevaNota = new Grupo(data);
            const nuevaNota_ = await NuevaNota.save()
            console.log('Se creo un nuevo grupo: ',nuevaNota_.nombre)
            io.emit('SERVER:NuevoGrupo', nuevaNota_)
        });
        // ******************
        // * Eliminar GRUPO *
        // ******************
        socket.on('CLIENTE:deleteGrupo', async (id) => {
            await Grupo.updateOne({_id:id}, {borrado:true})
            const Grupos = await Grupo.find({borrado:false})
            io.emit('cargarGrupos', Grupos)
        });
        // ****************
        // * EDITAR GRUPO *
        // ****************
        socket.on('CLIENTE:EditarGrupo', async (data) => {
            await Grupo.updateOne({_id:data.id}, data)
            const Grupos = await Grupo.find({borrado:false})
            io.emit('cargarGrupos', Grupos)
        });

        // *********************
        // * BUSCAR FABRICANTE *
        // *********************
        const emitirFabricantes = async () =>{
            const fabricantes = await Fabricante.find({borrado:false}).populate({path:'grupo'}).exec()
            io.emit('SERVER:Fabricantes', fabricantes)
        }

        socket.on('CLIENTE:BuscarFabricante', async () =>{
            await emitirFabricantes()
        })

        // ********************
        // * NUEVO FABRICANTE *
        // ********************
        socket.on('CLIENTE:NuevoFabricante', async(data) =>{
            delete data._id;
            const NuevoFabricante = new Fabricante(data);
            const NuevoFabricante_ = await NuevoFabricante.save()
            emitirFabricantes()
        })
        
        // *********************
        // * EDITAR FABRICANTE *
        // *********************
        socket.on('CLIENTE:EditarFabricante', async (data) => {

            let grupo = []
            for(let i=0;i<data.grupo.length;i++){
                grupo.push(data.grupo[i]._id)

                if(i === data.grupo.length -1){
                    data.grupo = grupo
                    await Fabricante.updateOne({_id:data._id}, data)
                    emitirFabricantes()
                }
            }
        });
        // ***********************
        // * ELIMINAR FABRICANTE *
        // ***********************
        socket.on('CLIENTE:deleteFabricante', async (id) => {
            await Fabricante.updateOne({_id:id}, {borrado:true})
            emitirFabricantes()
        });
        // ********************
        // * BUSCAR PROVEEDOR *
        // * ******************
        const emitirProveedores = async () =>{
            const fabricantes = await Fabricante.find({borrado:false}).populate({path:'grupo'}).exec()
            io.emit('SERVER:proveedores', fabricantes)
        }

        socket.on('CLIENTE:BuscarProveedores', async () =>{
            await emitirProveedores()
        })
        // *******************
        // * NUEVO PROVEEDOR *
        // *******************
        socket.on('CLIENTE:NuevoProveedor', async(data) =>{
            console.log('aqui')
            const NuevoProveedor = new Proveedor(data);
            const NuevoProveedor_ = await NuevoProveedor.save()
            console.log(NuevoProveedor_)
            emitirProveedores()
        })

    });
};