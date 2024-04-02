import grupoEvents from '../events/grupoEvents';
import proveedorEvents  from '../events/proveedorEvents'
import fabricanteEvents  from '../events/fabricanteEvents'
import materialEvents from '../events/materialEvents'
import recepcionEvents from '../events/recepcionEvents'
import especificacionEvents from '../events/especificacionEvents';
import almacenEvents from '../events/almacenEvents';
import analisisEvents from '../events/analisisEvents';
import fasesEvents from '../events/fasesEvents';
import maquinasEvents from '../events/maquinasEvents';
import clienteEvents from '../events/clienteEvents';
import categoriaEvents from '../events/categoriaEvents';
import defectoEvents from '../events/defectoEvents';

export default function configureEvents(io) {
    grupoEvents(io);
    proveedorEvents(io)
    fabricanteEvents(io)
    materialEvents(io)
    recepcionEvents(io)
    especificacionEvents(io)
    almacenEvents(io)
    analisisEvents(io)
    fasesEvents(io)
    maquinasEvents(io)
    clienteEvents(io)
    categoriaEvents(io)
    defectoEvents(io)
}