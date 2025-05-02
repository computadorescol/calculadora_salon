import { SERVICIOS, DESCUENTOS_CLIENTE, PAQUETES, CATEGORIAS } from './data.js';

// Referencias a elementos del DOM
const serviciosContainer = document.getElementById('seleccion-servicios');
const descuentoSelect = document.getElementById('descuento-cliente');
const resultadosResumenDiv = document.getElementById('resumen-calculos');
const comparativaDiv = document.getElementById('comparativa-rentabilidad');

// Elementos específicos de resultados
const precioBaseSpan = document.getElementById('precio-base');
const porcentajeDescuentoSpan = document.getElementById('porcentaje-descuento');
const montoDescuentoSpan = document.getElementById('monto-descuento');
const subtotalSpan = document.getElementById('subtotal');
const montoIvaSpan = document.getElementById('monto-iva');
const precioFinalSpan = document.getElementById('precio-final');
const tiempoTotalSpan = document.getElementById('tiempo-total');
const comisionTotalSpan = document.getElementById('comision-total');
const rentabilidadTotalSpan = document.getElementById('rentabilidad-total');

/**
 * Formatea un número como moneda (ej. 1234.5 -> 1,234.50)
 * @param {number} numero
 * @returns {string}
 */
function formatCurrency(numero) {
    return numero.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/**
 * Crea y añade los checkboxes de servicios al DOM, agrupados por categoría.
 */
export function popularServicios() {
    const serviciosHtml = Object.values(CATEGORIAS).map(categoria => {
        const serviciosCategoria = SERVICIOS.filter(s => s.categoria === categoria);
        if (serviciosCategoria.length === 0) return '';

        const itemsHtml = serviciosCategoria.map(servicio => `
            <li>
                <input type="checkbox" id="servicio-${servicio.id}" name="servicios" value="${servicio.id}">
                <label for="servicio-${servicio.id}">${servicio.nombre} (${servicio.tiempo} min)</label>
            </li>
        `).join('');

        return `
            <h3>${categoria}</h3>
            <ul>${itemsHtml}</ul>
        `;
    }).join('');

    // Insertar antes de cualquier botón de paquete existente
    const primerBoton = serviciosContainer.querySelector('button');
    if (primerBoton) {
        primerBoton.insertAdjacentHTML('beforebegin', serviciosHtml);
    } else {
        serviciosContainer.innerHTML += serviciosHtml; // Si no hay botones aún
    }
}


/**
 * Crea y añade los botones de paquetes al DOM.
 */
export function popularPaquetes() {
    if (PAQUETES.length > 0) {
        const paquetesHtml = `
            <h3>Paquetes Predefinidos</h3>
            <div id="paquetes-botones">
                ${PAQUETES.map(paquete => `
                    <button type="button" class="paquete-btn" data-paquete-id="${paquete.id}">
                        ${paquete.nombre} ${paquete.descuentoPropio > 0 ? `(${(paquete.descuentoPropio * 100).toFixed(0)}% Dcto.)` : ''}
                    </button>
                `).join('')}
                 <button type="button" id="ningun-paquete-btn" class="paquete-btn active" data-paquete-id="">Ninguno</button> <!-- Botón para deseleccionar paquete -->
            </div>
        `;
        serviciosContainer.innerHTML += paquetesHtml; // Añadir después de los servicios
    }
}


/**
 * Crea y añade las opciones de descuento al select.
 */
export function popularDescuentos() {
    DESCUENTOS_CLIENTE.forEach(desc => {
        const option = document.createElement('option');
        option.value = desc.valor;
        option.textContent = desc.nivel;
        descuentoSelect.appendChild(option);
    });
}

/**
 * Actualiza la sección de resultados con los totales calculados.
 * @param {object} totales - El objeto de totales devuelto por calculator.js.
 */
export function actualizarResultados(totales) {
    precioBaseSpan.textContent = formatCurrency(totales.precioBaseTotal);
    porcentajeDescuentoSpan.textContent = totales.porcentajeDescuentoAplicado.toFixed(0);
    montoDescuentoSpan.textContent = formatCurrency(totales.montoDescuentoTotal);
    subtotalSpan.textContent = formatCurrency(totales.subtotalTotal);
    montoIvaSpan.textContent = formatCurrency(totales.montoIVATotal);
    precioFinalSpan.textContent = formatCurrency(totales.precioFinalTotal);
    tiempoTotalSpan.textContent = `${totales.tiempoTotal} min`;
    comisionTotalSpan.textContent = formatCurrency(totales.comisionTotal);
    rentabilidadTotalSpan.textContent = `${totales.rentabilidadTotal.toFixed(1)}%`;

    // Actualizar comparativa de rentabilidad
    actualizarComparativa(totales.detallesServicios);
}

/**
 * Actualiza la sección de comparativa de rentabilidad.
 * @param {object[]} detallesServicios - Array con los detalles calculados de cada servicio.
 */
function actualizarComparativa(detallesServicios) {
    if (detallesServicios.length > 0) {
        const itemsHtml = detallesServicios.map(detalle => `
            <li>
                ${detalle.nombre}: ${detalle.rentabilidad.toFixed(1)}% (Ganancia: ${formatCurrency(detalle.gananciaNeta)})
            </li>
        `).join('');
        comparativaDiv.innerHTML = `
            <h3>Comparativa Rentabilidad por Servicio</h3>
            <ul>${itemsHtml}</ul>
        `;
    } else {
        comparativaDiv.innerHTML = '<h3>Comparativa Rentabilidad por Servicio</h3><p>Selecciona servicios para comparar.</p>';
    }
}

/**
 * Obtiene los IDs de los servicios actualmente seleccionados (checkboxes).
 * @returns {string[]} Array de IDs de servicios seleccionados.
 */
export function getServiciosSeleccionadosIds() {
    const checkboxes = document.querySelectorAll('input[name="servicios"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Obtiene el ID del paquete seleccionado (botón activo).
 * @returns {string|null} ID del paquete o null si ninguno está activo (excepto 'Ninguno').
 */
export function getPaqueteSeleccionadoId() {
    const botonActivo = document.querySelector('.paquete-btn.active');
    if (botonActivo && botonActivo.dataset.paqueteId) {
        return botonActivo.dataset.paqueteId;
    }
     // Si el botón activo es "Ninguno" o no hay activo, devuelve null o string vacío para indicar que no hay paquete.
    return botonActivo && botonActivo.id === 'ningun-paquete-btn' ? '' : null;
}


/**
 * Obtiene el valor del descuento seleccionado en el dropdown.
 * @returns {number} Valor del descuento (ej. 0.05).
 */
export function getDescuentoSeleccionadoValor() {
    return parseFloat(descuentoSelect.value);
}

/**
 * Desmarca todos los checkboxes de servicios.
 */
export function desmarcarTodosLosServicios() {
    const checkboxes = document.querySelectorAll('input[name="servicios"]:checked');
    checkboxes.forEach(cb => cb.checked = false);
}

/**
 * Marca los checkboxes correspondientes a los servicios de un paquete.
 * @param {string} paqueteId
 */
export function marcarServiciosDePaquete(paqueteId) {
    const paquete = PAQUETES.find(p => p.id === paqueteId);
    if (paquete) {
        paquete.serviciosIds.forEach(servicioId => {
            const checkbox = document.getElementById(`servicio-${servicioId}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
}

/**
 * Gestiona el estado activo de los botones de paquete.
 * @param {string} paqueteIdActivado - El ID del paquete que se acaba de activar.
 */
export function actualizarBotonesPaqueteActivo(paqueteIdActivado) {
    const botones = document.querySelectorAll('.paquete-btn');
    botones.forEach(boton => {
        if (boton.dataset.paqueteId === paqueteIdActivado) {
            boton.classList.add('active');
        } else {
            boton.classList.remove('active');
        }
    });
     // Asegurarse que el botón "Ninguno" esté activo si paqueteIdActivado es vacío/null
    if (!paqueteIdActivado) {
        const btnNinguno = document.getElementById('ningun-paquete-btn');
        if(btnNinguno) btnNinguno.classList.add('active');
    }
}