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
        socket.on('CLIENTE:NuevoProveedor', async (data) => {
            try {
                const existingProveedor = await Proveedor.findOne({ nombre: data.nombre, borrado:false });
        
                if (existingProveedor) {
                    console.log('El proveedor ya existe en la base de datos');
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'El proveedor ya existe en la base de datos', icon: 'info' });
                    return;
                }
        
                const nuevoProveedor = await Proveedor.create(data);
                console.log('Se creó nuevo fabricante');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se creó nuevo fabricante', icon: 'success' });
                emitirProveedores();
            } catch (err) {
                console.error('Ha ocurrido un error al registrar nuevo fabricante', err);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error al registrar nuevo fabricante', icon: 'error' });
            }
        });
        // ********************
        // * EDITAR PROVEEDOR *
        // ********************
        socket.on('CLIENTE:EditarProveedor', async(data) =>{
            try{
                const {_id, ...ProveedorData} = data;
                await Proveedor.updateOne({_id:_id}, ProveedorData)
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se editó fabricante', icon: 'success' });
                emitirProveedores();
            }catch(err){
                console.error('Ha ocurrido un error en la edición del proveedor', err)
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error en la edición del proveedor', icon: 'error' });
            }

        })

        // ***********************
        // * ELIMINAR PROVEEDOR *
        // ***********************
        socket.on('CLIENTE:deleteProveedor', async (id) => {
            try{
                await Proveedor.updateOne({_id:id}, {borrado:true})
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó un proveedor', icon: 'success' });
                emitirProveedores()
            }catch(err) {
                console.error('Ha ocurrido un error al elminar al Proveedor')
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error al elminar al proveedor', icon: 'error' });

            }


        });
    })
 
}