import producto from '../src/models/producto';

module.exports = (io) => {
  io.on('connection', (socket) => {
    const emitirProductos = async () =>{
        try {
            const Producto = await producto.find({borrado:false})
                                                .populate('identificacion.cliente identificacion.categoria materia_prima.sustrato materia_prima.tintas.tinta materia_prima.barnices.barniz pre_impresion.tamano_sustrato.montajes pre_impresion.tamano_sustrato.margenes pre_impresion.plancha impresion.impresoras impresion.pinzas post_impresion.troqueladora post_impresion.guillotina post_impresion.pegadora post_impresion.pegamento.pega post_impresion.caja')
                                                .populate({
                                                    path: 'materia_prima.sustrato',
                                                    populate: 'fabricante grupo especificacion especificacion2'
                                                })
                                                .populate({
                                                    path: 'materia_prima.barnices.barniz',
                                                    populate: 'fabricante grupo especificacion especificacion2'
                                                })
                                                .populate({
                                                    path: 'materia_prima.tintas.tinta',
                                                    populate: 'fabricante grupo especificacion especificacion2'
                                                })
                                                .populate({
                                                    path: 'impresion.fuentes',
                                                    populate: 'fabricante grupo especificacion especificacion2'
                                                })
                                                .exec()
            io.emit('SERVER:producto', Producto)
        } catch (error) {
            console.error('Error al buscar productos:', error)
        }
    }
    socket.on('CLIENTE:buscarProducto', async() => {
        try{
            await emitirProductos()
        }catch(err){
            console.error('No se pudo realizar la busqueda de las productos')
        }
    })

// CREAR PRODUCTO
socket.on('CLIENTE:nuevoProducto', async (data) => {
    console.log(data)
    // Verificar si los datos requeridos están completos
    if (!data.identificacion.producto) {
        console.log('Faltan datos requeridos para el producto');
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Faltan datos requeridos para crear la fase', icon: 'warning' });
    } else {
        try {
            const existingProducto = await producto.findOne({ 'identificacion.producto': data.identificacion.producto }); // Buscar producto por el campo "pantone"
            if (existingProducto) {
                // Producto ya existe, actualizar los campos con los nuevos datos
                Object.assign(existingProducto, data);
                await existingProducto.save();
                console.log('Se actualizó el producto existente');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó el producto existente', icon: 'success' });
                emitirProductos();
            } else {
                // Crear una nueva instancia de producto
                const NuevoProducto = new producto(data);
                await NuevoProducto.save();
                console.log('Se registró un nuevo producto');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró un nuevo producto', icon: 'success' });
                emitirProductos();
            }
        } catch (err) {
            console.error('Hubo un error en la operación:', err);
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la operación', icon: 'error' });
        }
    }
});




  })
}