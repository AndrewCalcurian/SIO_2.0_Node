import Proveedor from "../src/models/proveedor"

module.exports = (io) => {
    io.on('connection', (socket)=>{
               
        // ********************
        // * BUSCAR PROVEEDOR *
        // * ******************
        const emitirProveedores = async () =>{
            try{
                const proveedor = await Proveedor.find({borrado:false}).populate('fabricantes').exec()
                io.emit('SERVER:proveedores', proveedor)
            }catch(err){
                console.error('Ha ocurrido un erro con la busqueda de proveedores', err)
            }

        }

        socket.on('CLIENTE:BuscarProveedores', async () =>{
            try{
                await emitirProveedores()
            }catch(err){
                console.error('Ha ocurrido un erro con la busqueda de proveedores', err)
            }
        })
        // *******************
        // * NUEVO PROVEEDOR *
        // *******************
        socket.on('CLIENTE:NuevoProveedor', async(data) =>{
            try{
                const NuevoProveedor_ = await Proveedor.create(data)
                emitirProveedores()
            }catch(err){
                console.error('Ha ocurrido un error al registrar nuevo fabricante', err)
            }
            
        })
        // ********************
        // * EDITAR PROVEEDOR *
        // ********************
        socket.on('CLIENTE:EditarProveedor', async(data) =>{
            try{
                const {_id, ...ProveedorData} = data;
                await Proveedor.updateOneById(_id, ProveedorData)
                emitirProveedores();
            }catch(err){
                console.error('Ha ocurrido un error en la edición del proveedor', err)
            }

        })
    })
 
}