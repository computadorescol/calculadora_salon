import { calcularTotales } from './calculator.js';
import {
    popularServicios,
    popularPaquetes,
    popularDescuentos,
    actualizarResultados,
    getServiciosSeleccionadosIds,
    getPaqueteSeleccionadoId,
    getDescuentoSeleccionadoValor,
    desmarcarTodosLosServicios,
    marcarServiciosDePaquete,
    actualizarBotonesPaqueteActivo
} from './ui.js';

// --- ELEMENTOS DEL DOM ---
const serviciosContainer = document.getElementById('seleccion-servicios');
const descuentoSelect = document.getElementById('descuento-cliente');

// --- ESTADO DE LA APLICACIÓN ---
let paqueteActivoId = ''; // Para saber si un paquete está seleccionado

// --- FUNCIONES PRINCIPALES ---

/**
 * Función principal que se ejecuta cuando cambia cualquier selección
 * y necesita recalcular y actualizar la UI.
 */
function handleCalculationChange() {
    const serviciosIds = getServiciosSeleccionadosIds();
    const descuentoValor = getDescuentoSeleccionadoValor();

    // Si se cambió un checkbox individualmente mientras un paquete estaba activo,
    // desactivamos el paquete.
    if (paqueteActivoId && event && event.target.type === 'checkbox') {
        console.log("Checkbox cambiado, desactivando paquete activo.");
        paqueteActivoId = ''; // Resetea el paquete activo
        actualizarBotonesPaqueteActivo(paqueteActivoId); // Marca 'Ninguno' como activo
    }

    const totales = calcularTotales(serviciosIds, paqueteActivoId, descuentoValor);
    actualizarResultados(totales);
}

/**
 * Maneja el clic en un botón de paquete.
 * @param {Event} event
 */
function handlePaqueteClick(event) {
    if (!event.target.classList.contains('paquete-btn')) return; // Salir si no es un botón de paquete

    const clickedPaqueteId = event.target.dataset.paqueteId;

    // Si se hace clic en el paquete ya activo, no hacer nada (o deseleccionar?)
    // Por ahora, permitimos volver a hacer clic para forzar recálculo si es necesario.
    // if (clickedPaqueteId === paqueteActivoId) return;

    console.log(`Paquete clickeado: ${clickedPaqueteId || 'Ninguno'}`);
    paqueteActivoId = clickedPaqueteId; // Actualizar estado global

    desmarcarTodosLosServicios(); // Limpiar selección individual

    if (paqueteActivoId) {
        marcarServiciosDePaquete(paqueteActivoId); // Marcar los servicios del paquete
    }

    actualizarBotonesPaqueteActivo(paqueteActivoId); // Actualizar estilo de botones
    handleCalculationChange(); // Recalcular con el paquete (o sin él)
}


// --- INICIALIZACIÓN ---

/**
 * Inicializa la aplicación: popula la UI y añade event listeners.
 */
function init() {
    console.log("Inicializando calculadora...");
    popularServicios();
    popularPaquetes(); // Asegúrate que esto añade los botones
    popularDescuentos();

    // Listeners para cambios
    serviciosContainer.addEventListener('change', (event) => {
        // Escuchar cambios en checkboxes dentro del contenedor
        if (event.target.type === 'checkbox') {
            handleCalculationChange();
        }
    });
    serviciosContainer.addEventListener('click', handlePaqueteClick); // Listener para botones de paquete
    descuentoSelect.addEventListener('change', handleCalculationChange);

    // Calcular valores iniciales (todo a cero)
    handleCalculationChange();
    console.log("Calculadora inicializada.");
}

// Ejecutar inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);