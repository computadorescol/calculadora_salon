// Constantes y Datos Base para la Calculadora del Salón

export const IVA = 0.19; // 19%
export const COMISION_ESTILISTA = 0.30; // 30%

export const CATEGORIAS = {
    BASICO: 'Básico',
    COLORACION: 'Coloración',
    ESPECIALIZADO: 'Tratamientos Especializados',
    ESPECIFICO: 'Tratamientos Específicos'
};

export const MARGENES_POR_CATEGORIA = {
    [CATEGORIAS.BASICO]: 0.40,        // 40%
    [CATEGORIAS.COLORACION]: 0.45,     // 45%
    [CATEGORIAS.ESPECIALIZADO]: 0.55, // 55%
    [CATEGORIAS.ESPECIFICO]: 0.50      // 50%
};

export const DESCUENTOS_CLIENTE = [
    { nivel: 'Sin Descuento', valor: 0 },
    { nivel: 'Frecuente 5%', valor: 0.05 },
    { nivel: 'Frecuente 10%', valor: 0.10 },
    { nivel: 'Frecuente 15%', valor: 0.15 }
];

export const SERVICIOS = [
    // Servicios Básicos
    { id: 'corte', nombre: 'Corte de Cabello', categoria: CATEGORIAS.BASICO, costoBase: 15, costoProductos: 0, tiempo: 30 },
    { id: 'lavado_peinado', nombre: 'Lavado y Peinado', categoria: CATEGORIAS.BASICO, costoBase: 10, costoProductos: 0, tiempo: 20 },
    { id: 'secado', nombre: 'Secado', categoria: CATEGORIAS.BASICO, costoBase: 8, costoProductos: 0, tiempo: 15 },

    // Coloración
    { id: 'tinte_completo', nombre: 'Tinte Completo', categoria: CATEGORIAS.COLORACION, costoBase: 30, costoProductos: 20, tiempo: 90 },
    { id: 'mechas', nombre: 'Mechas', categoria: CATEGORIAS.COLORACION, costoBase: 40, costoProductos: 25, tiempo: 120 },
    { id: 'balayage', nombre: 'Balayage', categoria: CATEGORIAS.COLORACION, costoBase: 60, costoProductos: 35, tiempo: 150 },
    { id: 'ombre', nombre: 'Ombre', categoria: CATEGORIAS.COLORACION, costoBase: 50, costoProductos: 30, tiempo: 140 },

    // Tratamientos Especializados
    { id: 'hidratacion', nombre: 'Hidratación Profunda', categoria: CATEGORIAS.ESPECIALIZADO, costoBase: 35, costoProductos: 30, tiempo: 60 },
    { id: 'botox', nombre: 'Botox Capilar', categoria: CATEGORIAS.ESPECIALIZADO, costoBase: 70, costoProductos: 50, tiempo: 90 },
    { id: 'queratina', nombre: 'Queratina', categoria: CATEGORIAS.ESPECIALIZADO, costoBase: 90, costoProductos: 60, tiempo: 120 },
    { id: 'alisado', nombre: 'Alisado Permanente', categoria: CATEGORIAS.ESPECIALIZADO, costoBase: 100, costoProductos: 70, tiempo: 180 },

    // Tratamientos Específicos
    { id: 'anticaida', nombre: 'Anti-caída', categoria: CATEGORIAS.ESPECIFICO, costoBase: 45, costoProductos: 40, tiempo: 60 },
    { id: 'anticaspa', nombre: 'Anti-caspa', categoria: CATEGORIAS.ESPECIFICO, costoBase: 40, costoProductos: 35, tiempo: 45 },
    { id: 'sensible', nombre: 'Cuero Cabelludo Sensible', categoria: CATEGORIAS.ESPECIFICO, costoBase: 50, costoProductos: 45, tiempo: 60 }
];

// Paquetes de muestra (combinando servicios existentes)
export const PAQUETES = [
    {
        id: 'paquete_basico',
        nombre: 'Paquete Básico (Corte + Lavado/Peinado)',
        serviciosIds: ['corte', 'lavado_peinado'],
        descuentoPropio: 0.05 // 5% de descuento adicional por paquete
    },
    {
        id: 'paquete_color_hidrata',
        nombre: 'Paquete Color e Hidratación (Tinte + Hidratación)',
        serviciosIds: ['tinte_completo', 'hidratacion'],
        descuentoPropio: 0.10 // 10% de descuento adicional
    },
    {
        id: 'paquete_relax',
        nombre: 'Paquete Relax (Lavado/Peinado + Hidratación)',
        serviciosIds: ['lavado_peinado', 'hidratacion'],
        descuentoPropio: 0.0 // Sin descuento adicional, solo agrupa
    }
];

// Función auxiliar para obtener un servicio por ID (útil más adelante)
export function getServicioById(id) {
    return SERVICIOS.find(servicio => servicio.id === id);
}