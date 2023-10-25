import Fabricante from "../src/models/fabricante"

module.exports = (io)=>{
    io.on('connection', (socket) => {
        const emitirFabricantes = async () =>{
            try {
                const Fabricantes = await Fabricante.find({borrado:false}).populate('grupo').exec()
                io.emit('SERVER:Fabricantes', Fabricantes)
                console.log('Se realizó la consulta de los fabricantes')
            } catch (error) {
                console.error('Error al buscar fabricantes:', error)
            }
        }
1
        socket.on('CLIENTE:BuscarFabricante', async() => {
            try{
                await emitirFabricantes()
            }catch(err){
                console.error('No se pudo realizar la busqueda de los fabricantes')
            }
        })


        // ********************
        // * NUEVO FABRICANTE *
        // ********************
        socket.on('CLIENTE:NuevoFabricante', async (data) => {
            try {
                const { _id, ...fabricanteData } = data;
                const nuevoFabricante = await Fabricante.create(fabricanteData);
                emitirFabricantes();3
            } catch (error) {
                console.error('Ha ocurrido un error al crear el nuevo fabricante:', error);
            }
        });
        
        // *********************
        // * EDITAR FABRICANTE *
        // *********************
        socket.on('CLIENTE:EditarFabricante', async (data) => {
            try {
                const grupoIds = data.grupo.map(grupo => grupo._id);
                data.grupo = grupoIds;
                console.log(data)
                await Fabricante.findByIdAndUpdate(data._id, data);
                emitirFabricantes();
            } catch (error) {
                console.error('Error al editar el fabricante:', error);
            }
        });
        // ***********************
        // * ELIMINAR FABRICANTE *
        // ***********************
        socket.on('CLIENTE:deleteFabricante', async (id) => {
            try{
                await Fabricante.updateOne({_id:id}, {borrado:true})
                emitirFabricantes()
            }catch(err) {
                console.error('Ha ocurrido un error al elminar al fabricante')
            }


        });
    })
}