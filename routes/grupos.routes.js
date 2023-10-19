import Grupo from '../src/models/grupo'

export const emitGrupos = async (io) =>{
    console.log('alguien Nuevo se conectó')
    const Grupos = await Grupo.find()
    io.emit('cargarGrupos', Grupos)
}

