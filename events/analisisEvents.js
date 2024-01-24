import AnalisisTinta from "../src/models/analisis-tinta";
import AnalisisSustrato from "../src/models/analisis-sustrato"
import recepcion from "../src/models/recepcion";
import Recepcion from "../src/models/recepcion";
module.exports = (io) => {
    io.on('connection', (socket) => {
        
        const EmitirAnalisisTinta = async() => {
            try{
                const AnalisisTinta_ = await AnalisisTinta.find().exec()
                io.emit('SERVER:AnalisisTinta', AnalisisTinta_)
            }catch(err){
                console.error('Error al buscar analisis:', err)
            }
        }

        socket.on('CLIENTE:BuscarAnalisisTinta', async()=>{
            try {
                await EmitirAnalisisTinta()
              } catch (err) {
                console.error('No se pudo realizar la busqueda del almacen', err)
              }
        })

        socket.on('CLIENTE:AnalisisTinta', async (data) => {
            // Verificar si los datos requeridos están completos
            const NuevoAnalisis = new AnalisisTinta(data.data);
            const doc = await AnalisisTinta.findOne({ _id: data.data._id });
            if (doc) {
                try{

                    await AnalisisTinta.findByIdAndUpdate(data.data._id, data.data);
                    console.log('Se actualizo nuevo analisis');
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizo analisis', icon: 'success' });
                    EmitirAnalisisTinta();
                    return;  
                }catch(err){
                    console.log('Error en actualizacion de analisis');
                    return
                }
            }
            try {
              await NuevoAnalisis.save();
              const reception = await recepcion.findOne({ _id: data.recepcion._id });
              reception.materiales[data.index].forEach((material) => {
                material.analisis = NuevoAnalisis._id;
              });
              await reception.save();
              console.log('Se realizó nuevo analisis');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó nuevo analisis', icon: 'success' });
            } catch (err) {
              console.error('Hubo un error en el registro del analisis:', err);
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en el registro del analisis', icon: 'error' });
            }
            EmitirAnalisisTinta();
          });

          const EmitirAnalisisSustrato = async() => {
            try{
                const AnalisisSustrato_ = await AnalisisSustrato.find().exec()
                io.emit('SERVER:AnalisisSustrato', AnalisisSustrato_)
            }catch(err){
                console.error('Error al buscar analisis:', err)
            }
        }

        socket.on('CLIENTE:BuscarAnalisisSustrato', async()=>{
            try {
                await EmitirAnalisisSustrato()
              } catch (err) {
                console.error('No se pudo realizar la busqueda del analisis', err)
              }
        })

        socket.on('CLIENTE:AnalisisSustrato', async (data) => {
          // Verificar si los datos requeridos están completos
          const NuevoAnalisis = new AnalisisSustrato(data.data);
          const doc = await AnalisisSustrato.findOne({ _id: data.data._id });
          if (doc) {
              try{

                  await AnalisisSustrato.findByIdAndUpdate(data.data._id, data.data);
                  console.log('Se actualizo nuevo analisis de Sustrato');
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizo analisis', icon: 'success' });
                  EmitirAnalisisSustrato()
                  return;  
              }catch(err){
                  console.log('Error en actualizacion de analisis');
                  return
              }
          }
          try {
            await NuevoAnalisis.save();
            const reception = await recepcion.findOne({ _id: data.recepcion._id });
            reception.materiales[data.index].forEach((material) => {
              material.analisis = NuevoAnalisis._id;
            });
            await reception.save();
            console.log('Se realizó nuevo analisis de Sustrato');
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó nuevo analisis', icon: 'success' });
          } catch (err) {
            console.error('Hubo un error en el registro del analisis:', err);
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en el registro del analisis', icon: 'error' });
          }
          EmitirAnalisisSustrato()
        });
    })  
}