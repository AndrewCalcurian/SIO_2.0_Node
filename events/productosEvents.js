import producto from '../src/models/producto';
import HistorialCambios from '../src/models/historial-cambios';
const _ = require('lodash');

module.exports = (io) => {
  io.on('connection', (socket) => {

    // const obtenerDiferencias = async(obj1, obj2) => {
    //     function cambios(objetoBase, objetoComparar) {
    //       function cambiosInternos(base, comparar, ruta = '') {
    //         return _.transform(base, (resultado, valor, clave) => {
    //           const valorComparar = comparar[clave];
    //           const rutaActual = ruta ? `${ruta}.${clave}` : clave;
      
    //           if (!_.isEqual(valor, valorComparar)) {
    //             resultado[rutaActual] = _.isObject(valor) && _.isObject(valorComparar) ?
    //               cambiosInternos(valor, valorComparar, rutaActual) : { original: valor, nuevo: valorComparar };
    //           }
    //         });
    //       }
      
    //       return cambiosInternos(objetoBase, objetoComparar);
    //     }
      
    //     return cambios(obj1, obj2);
    //   }
      
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

    // function diffObjects(obj1, obj2) {
    //     const diff = {};
    //     for (let key in obj1) {
    //         if (obj1[key] !== obj2[key]) {
    //             if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
    //                 // Comparar objetos anidados recursivamente
    //                 const nestedDiff = diffObjects(obj1[key], obj2[key]);
    //                 if (Object.keys(nestedDiff).length > 0) {
    //                     diff[key] = nestedDiff;
    //                 }
    //             } else {
    //                 diff[key] = obj1[key];
    //             }
    //         }
    //     }
    //     return diff;
    // }

    socket.on('CLIENTE:nuevoProducto', async (data) => {
        try {
            if (data._id) {
                const existingProducto = await producto.findById(data._id);
                if (existingProducto) {

                    console.log(data.materia_prima.tintas)
                    return
                    data.identificacion.cliente = data.identificacion.cliente._id
                    data.identificacion.categoria = data.identificacion.categoria._id

                    if (data.materia_prima.sustrato && Array.isArray(data.materia_prima.sustrato)) {
                        data.materia_prima.sustrato = data.materia_prima.sustrato.map(s => s._id);
                    }
                    
                    if (data.materia_prima.tintas && Array.isArray(data.materia_prima.tintas)) {
                        data.materia_prima.tintas = data.materia_prima.tintas.map(t => ({
                            tinta: t.tinta._id,
                            cantidad: t.cantidad
                        }));
                    }
                    
                    if (data.materia_prima.barnices && Array.isArray(data.materia_prima.barnices)) {
                        data.materia_prima.barnices = data.materia_prima.barnices.map(b => ({
                            barniz: b.barniz._id,
                            cantidad: b.cantidad
                        }));
                    }

                    
                    // Para 'impresion'
                        if (data.impresion.impresoras && Array.isArray(data.impresion.impresoras)) {
                            data.impresion.impresoras = data.impresion.impresoras.map(i => i._id);
                        }

                        if (data.impresion.fuentes && Array.isArray(data.impresion.fuentes)) {
                            data.impresion.fuentes = data.impresion.fuentes.map(f => f._id);
                        }

                        // Para 'post_impresion'
                        if (data.post_impresion.troqueladora && Array.isArray(data.post_impresion.troqueladora)) {
                            data.post_impresion.troqueladora = data.post_impresion.troqueladora.map(t => t._id);
                        }

                        if (data.post_impresion.guillotina && Array.isArray(data.post_impresion.guillotina)) {
                            data.post_impresion.guillotina = data.post_impresion.guillotina.map(g => g._id);
                        }

                        if (data.post_impresion.pegadora && Array.isArray(data.post_impresion.pegadora)) {
                            data.post_impresion.pegadora = data.post_impresion.pegadora.map(p => p._id);
                        }

                        if (data.post_impresion.pegamento && Array.isArray(data.post_impresion.pegamento)) {
                            data.post_impresion.pegamento = data.post_impresion.pegamento.map(p => ({
                                pega: p.pega._id,
                                cantidad: p.cantidad
                            }));
                        }

                    const cambios = {};
    
                    // Recorrer y comparar las claves del objeto `identificacion`
                    for (let key in data.identificacion) {
                        if (data.identificacion[key] !== existingProducto.identificacion[key]) {
                            cambios[`identificacion.${key}`] = `De: ${existingProducto.identificacion[key]} A: ${data.identificacion[key]}`;
                        }
                    }
    
                    // Comparar las demás secciones (ejemplo: dimensiones, materia_prima, etc.)
                    for (let section in data) {
                        if (section !== 'identificacion' && section !== '_id' && typeof data[section] === 'object') {
                            for (let key in data[section]) {
                                if (JSON.stringify(data[section][key]) !== JSON.stringify(existingProducto[section][key])) {
                                    cambios[`${section}.${key}`] = `De: ${JSON.stringify(existingProducto[section][key])} A: ${JSON.stringify(data[section][key])}`;
                                }
                            }
                        }
                    }
    
                    // Si hay cambios, guardarlos en el historial
                    if (Object.keys(cambios).length > 0) {
                        const nuevoHistorial = new HistorialCambios({
                            producto: data._id,
                            cambios
                        });
                        await nuevoHistorial.save();
                    }
    
                    // Actualizar el producto
                    await producto.findByIdAndUpdate(data._id, data);
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Producto actualizado correctamente', icon: 'success' });
                } else {
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'No se encontró ningún producto con el ID proporcionado', icon: 'warning' });
                }
            } else {
                const newProducto = new producto(data);
                await newProducto.save();
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Producto creado correctamente', icon: 'success' });
            }
            emitirProductos();
        } catch (err) {
            console.error('Error al procesar el producto:', err);
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error al procesar el producto', icon: 'error' });
        }
    });
    




  })
}