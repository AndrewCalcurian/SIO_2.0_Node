import grupoEvents from '../events/grupoEvents';
import proveedorEvents  from '../events/proveedorEvents'
import fabricanteEvents  from '../events/fabricanteEvents'
import materialEvents from '../events/materialEvents';

export default function configureEvents(io) {
    grupoEvents(io);
    proveedorEvents(io)
    fabricanteEvents(io)
    materialEvents(io)
}