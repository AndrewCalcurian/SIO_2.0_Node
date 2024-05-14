import producto from '../src/models/producto';
const _ = require('lodash');

module.exports = (io) => {
  io.on('connection', (socket) => {
    const obtenerDiferencias = async(obj1, obj2) => {
        function cambios(objetoBase, objetoComparar) {
          function cambiosInternos(base, comparar, ruta = '') {
            return _.transform(base, (resultado, valor, clave) => {
              const valorComparar = comparar[clave];
              const rutaActual = ruta ? `${ruta}.${clave}` : clave;
      
              if (!_.isEqual(valor, valorComparar)) {
                resultado[rutaActual] = _.isObject(valor) && _.isObject(valorComparar) ?
                  cambiosInternos(valor, valorComparar, rutaActual) : { original: valor, nuevo: valorComparar };
              }
            });
          }
      
          return cambiosInternos(objetoBase, objetoComparar);
        }
      
        return cambios(obj1, obj2);
      }
      
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

    function diffObjects(obj1, obj2) {
        const diff = {};
        for (let key in obj1) {
            if (obj1[key] !== obj2[key]) {
                if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                    // Comparar objetos anidados recursivamente
                    const nestedDiff = diffObjects(obj1[key], obj2[key]);
                    if (Object.keys(nestedDiff).length > 0) {
                        diff[key] = nestedDiff;
                    }
                } else {
                    diff[key] = obj1[key];
                }
            }
        }
        return diff;
    }

// CREAR PRODUCTO
socket.on('CLIENTE:nuevoProducto', async (data) => {
    console.log(data);

    // Verificar si existe el campo _id en los datos
    if (data._id) {
        try {
            const existingProducto = await producto.findById(data._id);
            if (existingProducto) {
                console.log('Producto encontrado en la base de datos:', existingProducto);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Producto encontrado en la base de datos', icon: 'info' });

                // Comparar las diferencias entre data y existingProducto
                const diferencias = diffObjects(existingProducto, data);
                console.log('Diferencias encontradas:', diferencias);
                socket.emit('SERVIDOR:diferencias', diferencias);
            } else {
                console.log('No se encontró ningún producto con el ID proporcionado');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'No se encontró ningún producto con el ID proporcionado', icon: 'warning' });
            }
        } catch (err) {
            console.error('Error al buscar el producto en la base de datos:', err);
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error al buscar el producto en la base de datos', icon: 'error' });
        }
    } else {
        // Verificar si los datos requeridos están completos
        if (!data.identificacion.producto) {
            console.log('Faltan datos requeridos para el producto');
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Faltan datos requeridos para crear la fase', icon: 'warning' });
        } else {
            try {
                const existingProducto = await producto.findOne({ 'identificacion.producto': data.identificacion.producto });
                if (existingProducto) {
                    Object.assign(existingProducto, data);
                    await existingProducto.save();
                    console.log('Se actualizó el producto existente');
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó el producto existente', icon: 'success' });
                    emitirProductos();
                } else {
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
    }
});




  })
}