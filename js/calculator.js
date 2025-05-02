import { IVA, COMISION_ESTILISTA, MARGENES_POR_CATEGORIA, getServicioById, PAQUETES } from './data.js';

/**
 * Calcula los detalles financieros y de tiempo para un único servicio.
 * @param {object} servicio - El objeto del servicio desde data.js.
 * @param {number} descuentoCliente - El valor del descuento del cliente (ej. 0.05 para 5%).
 * @returns {object|null} Un objeto con los cálculos o null si hay error.
 */
function calcularDetallesServicio(servicio, descuentoCliente = 0) {
    if (!servicio || !servicio.categoria || MARGENES_POR_CATEGORIA[servicio.categoria] === undefined) {
        console.error("Error: Servicio inválido o categoría/margen no definido.", servicio);
        return null;
    }

    const margen = MARGENES_POR_CATEGORIA[servicio.categoria];
    if (margen >= 1) {
        console.error("Error: Margen de rentabilidad debe ser menor que 1 (100%).", servicio);
        return null; // Evita división por cero o negativa
    }

    const costoTotalInsumos = servicio.costoBase + servicio.costoProductos;
    const precioSinIVA = costoTotalInsumos / (1 - margen);
    const precioConDescuentoSinIVA = precioSinIVA * (1 - descuentoCliente);
    const montoDescuento = precioSinIVA * descuentoCliente;

    const montoIVA = precioConDescuentoSinIVA * IVA;
    const precioFinal = precioConDescuentoSinIVA + montoIVA;

    const comisionEstilista = precioSinIVA * COMISION_ESTILISTA; // Comisión sobre precio base sin IVA ni descuento cliente

    // Ganancia antes de costos fijos generales
    const gananciaNeta = precioConDescuentoSinIVA - costoTotalInsumos - comisionEstilista;

    // Rentabilidad sobre el ingreso neto (precio con descuento sin IVA)
    const rentabilidad = precioConDescuentoSinIVA > 0 ? (gananciaNeta / precioConDescuentoSinIVA) * 100 : 0;

    return {
        id: servicio.id,
        nombre: servicio.nombre,
        costoTotalInsumos: costoTotalInsumos,
        precioSinIVA: precioSinIVA,
        montoDescuento: montoDescuento,
        precioConDescuentoSinIVA: precioConDescuentoSinIVA,
        montoIVA: montoIVA,
        precioFinal: precioFinal,
        comisionEstilista: comisionEstilista,
        gananciaNeta: gananciaNeta,
        rentabilidad: rentabilidad, // Porcentaje
        tiempo: servicio.tiempo
    };
}

/**
 * Calcula los totales para una lista de servicios seleccionados o un paquete.
 * @param {string[]} serviciosSeleccionadosIds - Array de IDs de servicios seleccionados.
 * @param {string|null} paqueteSeleccionadoId - ID del paquete seleccionado (o null).
 * @param {number} descuentoClienteValor - Valor del descuento del cliente (ej. 0.05).
 * @returns {object} Un objeto con los totales calculados.
 */
export function calcularTotales(serviciosSeleccionadosIds, paqueteSeleccionadoId, descuentoClienteValor) {
    let detallesCalculados = [];
    let descuentoPaquete = 0;
    let idsParaCalcular = [...serviciosSeleccionadosIds]; // Copia para no modificar original

    // Si se selecciona un paquete, usar sus servicios y descuento propio
    if (paqueteSeleccionadoId) {
        const paquete = PAQUETES.find(p => p.id === paqueteSeleccionadoId);
        if (paquete) {
            idsParaCalcular = [...paquete.serviciosIds]; // Usar los IDs del paquete
            descuentoPaquete = paquete.descuentoPropio || 0;
        }
    }

    // Calcular detalles para cada servicio ID
    idsParaCalcular.forEach(id => {
        const servicio = getServicioById(id);
        if (servicio) {
            // Aplicar descuento de paquete ADEMÁS del descuento de cliente
            // El descuento del paquete se aplica sobre el precioSinIVA antes del descuento del cliente
            const descuentoTotalAplicable = descuentoClienteValor + descuentoPaquete - (descuentoClienteValor * descuentoPaquete); // Formula para combinar descuentos
            const detalles = calcularDetallesServicio(servicio, descuentoTotalAplicable);
            if (detalles) {
                detallesCalculados.push(detalles);
            }
        }
    });

    // Agregar totales
    const totales = detallesCalculados.reduce((acc, detalle) => {
        acc.precioBaseTotal += detalle.precioSinIVA;
        acc.montoDescuentoTotal += detalle.montoDescuento; // Ojo: este descuento es solo el del cliente, falta el del paquete si aplica
        acc.subtotalTotal += detalle.precioConDescuentoSinIVA; // Este ya tiene ambos descuentos
        acc.montoIVATotal += detalle.montoIVA;
        acc.precioFinalTotal += detalle.precioFinal;
        acc.tiempoTotal += detalle.tiempo;
        acc.comisionTotal += detalle.comisionEstilista;
        acc.gananciaNetaTotal += detalle.gananciaNeta;
        return acc;
    }, {
        precioBaseTotal: 0,
        montoDescuentoTotal: 0, // Necesita recalcularse si hay paquete
        subtotalTotal: 0,
        montoIVATotal: 0,
        precioFinalTotal: 0,
        tiempoTotal: 0,
        comisionTotal: 0,
        gananciaNetaTotal: 0
    });

    // Recalcular descuento total si hay paquete para mostrarlo correctamente
    if (paqueteSeleccionadoId && descuentoPaquete > 0) {
         const descuentoTotalCombinado = descuentoClienteValor + descuentoPaquete - (descuentoClienteValor * descuentoPaquete);
         totales.montoDescuentoTotal = totales.precioBaseTotal * descuentoTotalCombinado;
         totales.porcentajeDescuentoAplicado = descuentoTotalCombinado * 100;
    } else {
        totales.montoDescuentoTotal = totales.precioBaseTotal * descuentoClienteValor;
        totales.porcentajeDescuentoAplicado = descuentoClienteValor * 100;
    }


    // Calcular rentabilidad promedio ponderada por precioConDescuentoSinIVA
    const rentabilidadTotal = totales.subtotalTotal > 0
        ? (totales.gananciaNetaTotal / totales.subtotalTotal) * 100
        : 0;

    return {
        ...totales,
        rentabilidadTotal: rentabilidadTotal,
        detallesServicios: detallesCalculados // Para la comparativa
    };
}