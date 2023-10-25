import grupoEvents from './grupoEvents';
import sockets  from '../src/sockets';
import proveedorEvents  from './proveedorEvents'
import fabricanteEvents  from './fabricanteEvents'

export default function configureEvents(io) {
    sockets(io);
    grupoEvents(io);
    proveedorEvents(io)
    fabricanteEvents(io)
}