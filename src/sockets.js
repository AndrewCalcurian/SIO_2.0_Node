import Grupo from './models/grupo';
export default (io) => {

    io.on('connection', (socket) =>{  
        
        const emitGrupos = async () =>{
            console.log('alguien Nuevo se conectó')
            const Grupos = await Grupo.find()
            io.emit('cargarGrupos', Grupos)
        }
        emitGrupos()

        socket.on('NuevoGrupo', async (data) => {
            const NuevaNota = new Grupo(data);
            const nuevaNota_ = await NuevaNota.save()
            console.log(nuevaNota_)
            io.emit('newGroup', nuevaNota_)
        });
    });
};