import grupoEvents from '../events/grupoEvents';
import proveedorEvents  from '../events/proveedorEvents'
import fabricanteEvents  from '../events/fabricanteEvents'
import materialEvents from '../events/materialEvents'
import recepcionEvents from '../events/recepcionEvents'
import especificacionEvents from '../events/especificacionEvents';

export default function configureEvents(io) {
    grupoEvents(io);
    proveedorEvents(io)
    fabricanteEvents(io)
    materialEvents(io)
    recepcionEvents(io)
    especificacionEvents(io)
}