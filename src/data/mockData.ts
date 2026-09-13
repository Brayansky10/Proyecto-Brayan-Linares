/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CuentaPorCobrar, FlujoCaja, PuntoPrediccion, ConfigModelos, AlertaFlujo } from '../types';

// Clientes típicos de repuestos automotrices (distribuidores, talleres, flotas)
export const CLIENTES_AIKO = [
  'Taller El Amigo - Multimarca',
  'Autoservicios del Sur S.A.',
  'Lubricentro San Cristóbal',
  'Repuestos y Frenos La 50',
  'Distribuidora de Embragues Mendoza',
  'Consorcio de Transporte Metropolitano',
  'Taller Especializado Nippon',
  'Inversiones Mecánicas Express',
  'Flotas Falcon S.R.L.',
  'AutoPartes El Rayo'
];

// Generar Cuentas por Cobrar realistas
export const CUENTAS_POR_COBRAR_MOCK: CuentaPorCobrar[] = [
  {
    id: 'CC-101',
    cliente: 'Taller El Amigo - Multimarca',
    factura: 'F-2026-405',
    monto: 3450.00,
    fechaEmision: '2026-06-15',
    fechaVencimiento: '2026-07-15',
    estado: 'Pendiente',
    categoriaCliente: 'B',
    probabilidadPago: 88,
    diasRetrasoEstimado: 3,
    montoRecuperable: 3450.00
  },
  {
    id: 'CC-102',
    cliente: 'Autoservicios del Sur S.A.',
    factura: 'F-2026-410',
    monto: 12800.00,
    fechaEmision: '2026-05-10',
    fechaVencimiento: '2026-07-10',
    estado: 'En Mora',
    categoriaCliente: 'C',
    probabilidadPago: 42,
    diasRetrasoEstimado: 25,
    montoRecuperable: 8500.00
  },
  {
    id: 'CC-103',
    cliente: 'Lubricentro San Cristóbal',
    factura: 'F-2026-412',
    monto: 1950.00,
    fechaEmision: '2026-06-20',
    fechaVencimiento: '2026-07-20',
    estado: 'Pendiente',
    categoriaCliente: 'A',
    probabilidadPago: 97,
    diasRetrasoEstimado: 0,
    montoRecuperable: 1950.00
  },
  {
    id: 'CC-104',
    cliente: 'Repuestos y Frenos La 50',
    factura: 'F-2026-418',
    monto: 7890.00,
    fechaEmision: '2026-05-25',
    fechaVencimiento: '2026-06-25',
    estado: 'Vencido',
    categoriaCliente: 'B',
    probabilidadPago: 75,
    diasRetrasoEstimado: 12,
    montoRecuperable: 7890.00
  },
  {
    id: 'CC-105',
    cliente: 'Distribuidora de Embragues Mendoza',
    factura: 'F-2026-421',
    monto: 15400.00,
    fechaEmision: '2026-06-01',
    fechaVencimiento: '2026-08-01',
    estado: 'Pendiente',
    categoriaCliente: 'A',
    probabilidadPago: 95,
    diasRetrasoEstimado: 1,
    montoRecuperable: 15400.00
  },
  {
    id: 'CC-106',
    cliente: 'Consorcio de Transporte Metropolitano',
    factura: 'F-2026-425',
    monto: 24500.00,
    fechaEmision: '2026-05-15',
    fechaVencimiento: '2026-07-15',
    estado: 'En Mora',
    categoriaCliente: 'C',
    probabilidadPago: 30,
    diasRetrasoEstimado: 35,
    montoRecuperable: 11000.00
  },
  {
    id: 'CC-107',
    cliente: 'Taller Especializado Nippon',
    factura: 'F-2026-430',
    monto: 4120.00,
    fechaEmision: '2026-06-28',
    fechaVencimiento: '2026-07-28',
    estado: 'Pendiente',
    categoriaCliente: 'B',
    probabilidadPago: 81,
    diasRetrasoEstimado: 4,
    montoRecuperable: 4120.00
  },
  {
    id: 'CC-108',
    cliente: 'Inversiones Mecánicas Express',
    factura: 'F-2026-435',
    monto: 5300.00,
    fechaEmision: '2026-07-02',
    fechaVencimiento: '2026-08-02',
    estado: 'Pendiente',
    categoriaCliente: 'A',
    probabilidadPago: 99,
    diasRetrasoEstimado: 0,
    montoRecuperable: 5300.00
  },
  {
    id: 'CC-109',
    cliente: 'Flotas Falcon S.R.L.',
    factura: 'F-2026-438',
    monto: 18900.00,
    fechaEmision: '2026-06-10',
    fechaVencimiento: '2026-08-10',
    estado: 'Pendiente',
    categoriaCliente: 'B',
    probabilidadPago: 83,
    diasRetrasoEstimado: 5,
    montoRecuperable: 18900.00
  },
  {
    id: 'CC-110',
    cliente: 'AutoPartes El Rayo',
    factura: 'F-2026-440',
    monto: 6100.00,
    fechaEmision: '2026-06-05',
    fechaVencimiento: '2026-07-05',
    estado: 'Vencido',
    categoriaCliente: 'C',
    probabilidadPago: 55,
    diasRetrasoEstimado: 18,
    montoRecuperable: 5100.00
  }
];

// Flujo de caja tradicional histórico (Ene 2026 - Jun 2026)
export const FLUJO_HISTORICO_MOCK: FlujoCaja[] = [
  { id: 'FC-01', fecha: '2026-01-15', tipo: 'Ingreso', categoria: 'Ventas de Contado', monto: 35000, origen: 'Real', descripcion: 'Ventas de contado línea repuestos motor' },
  { id: 'FC-02', fecha: '2026-01-20', tipo: 'Ingreso', categoria: 'Cobro Ventas Crédito', monto: 22000, origen: 'Real', descripcion: 'Cobranza Talleres multimarca' },
  { id: 'FC-03', fecha: '2026-01-25', tipo: 'Egreso', categoria: 'Importación Repuestos', monto: 40000, origen: 'Real', descripcion: 'Pago proveedor Japón (Koyo)' },
  { id: 'FC-04', fecha: '2026-02-15', tipo: 'Ingreso', categoria: 'Ventas de Contado', monto: 38000, origen: 'Real', descripcion: 'Ventas de contado línea frenos' },
  { id: 'FC-05', fecha: '2026-02-20', tipo: 'Ingreso', categoria: 'Cobro Ventas Crédito', monto: 25000, origen: 'Real', descripcion: 'Cobranza Concesionarios' },
  { id: 'FC-06', fecha: '2026-02-28', tipo: 'Egreso', categoria: 'Gastos Operativos', monto: 12000, origen: 'Real', descripcion: 'Nómina y servicios Aiko' },
  { id: 'FC-07', fecha: '2026-03-15', tipo: 'Ingreso', categoria: 'Ventas de Contado', monto: 42000, origen: 'Real', descripcion: 'Ventas de contado filtros y lubricantes' },
  { id: 'FC-08', fecha: '2026-03-22', tipo: 'Ingreso', categoria: 'Cobro Ventas Crédito', monto: 18000, origen: 'Real', descripcion: 'Cobranza distribuidores' },
  { id: 'FC-09', fecha: '2026-03-25', tipo: 'Egreso', categoria: 'Importación Repuestos', monto: 35000, origen: 'Real', descripcion: 'Pago proveedor alternativo Corea' },
  { id: 'FC-10', fecha: '2026-04-15', tipo: 'Ingreso', categoria: 'Ventas de Contado', monto: 41000, origen: 'Real', descripcion: 'Ventas de contado accesorios eléctricos' },
  { id: 'FC-11', fecha: '2026-04-20', tipo: 'Ingreso', categoria: 'Cobro Ventas Crédito', monto: 21000, origen: 'Real', descripcion: 'Cobranza general' },
  { id: 'FC-12', fecha: '2026-04-30', tipo: 'Egreso', categoria: 'Gastos Operativos', monto: 12500, origen: 'Real', descripcion: 'Nómina y logística de distribución' },
  { id: 'FC-13', fecha: '2026-05-15', tipo: 'Ingreso', categoria: 'Ventas de Contado', monto: 45000, origen: 'Real', descripcion: 'Ventas de contado línea suspensión' },
  { id: 'FC-14', fecha: '2026-05-20', tipo: 'Ingreso', categoria: 'Cobro Ventas Crédito', monto: 14000, origen: 'Real', descripcion: 'Cobranza baja por mora del Sur' },
  { id: 'FC-15', fecha: '2026-05-25', tipo: 'Egreso', categoria: 'Importación Repuestos', monto: 45000, origen: 'Real', descripcion: 'Pago lote de repuestos alta rotación' },
  { id: 'FC-16', fecha: '2026-06-15', tipo: 'Ingreso', categoria: 'Ventas de Contado', monto: 48000, origen: 'Real', descripcion: 'Ventas de contado lubricantes y bujías' },
  { id: 'FC-17', fecha: '2026-06-20', tipo: 'Ingreso', categoria: 'Cobro Ventas Crédito', monto: 16000, origen: 'Real', descripcion: 'Cobranza parcial Embragues Mendoza' },
  { id: 'FC-18', fecha: '2026-06-30', tipo: 'Egreso', categoria: 'Gastos Operativos', monto: 13000, origen: 'Real', descripcion: 'Nómina y administración' }
];

// Puntos de predicción del modelo Prophet (Diario/Agrupado cada 5 días para visualización óptima)
// Abarca histórico (Ene 2026 - Jun 2026) y proyección a futuro (Julio 2026 - Septiembre 2026, 90 días)
export const PUNTOS_PREDICCION_MOCK: PuntoPrediccion[] = [
  // Enero 2026
  { fecha: '2026-01-05', real: 15200, predicho: 14800, limiteInferior: 12000, limiteSuperior: 17000, volumenVentasCredito: 18000 },
  { fecha: '2026-01-15', real: 18500, predicho: 17500, limiteInferior: 14500, limiteSuperior: 20000, volumenVentasCredito: 19500 },
  { fecha: '2026-01-25', real: 14100, predicho: 15000, limiteInferior: 12500, limiteSuperior: 17500, volumenVentasCredito: 14000 },
  // Febrero 2026
  { fecha: '2026-02-05', real: 16400, predicho: 15900, limiteInferior: 13000, limiteSuperior: 18500, volumenVentasCredito: 16500 },
  { fecha: '2026-02-15', real: 19100, predicho: 18200, limiteInferior: 15000, limiteSuperior: 21000, volumenVentasCredito: 21000 },
  { fecha: '2026-02-25', real: 15500, predicho: 16000, limiteInferior: 13500, limiteSuperior: 18500, volumenVentasCredito: 15000 },
  // Marzo 2026
  { fecha: '2026-03-05', real: 17900, predicho: 17200, limiteInferior: 14500, limiteSuperior: 20000, volumenVentasCredito: 19000 },
  { fecha: '2026-03-15', real: 20800, predicho: 19800, limiteInferior: 17000, limiteSuperior: 22500, volumenVentasCredito: 23500 },
  { fecha: '2026-03-25', real: 16900, predicho: 17100, limiteInferior: 14500, limiteSuperior: 19500, volumenVentasCredito: 17000 },
  // Abril 2026
  { fecha: '2026-04-05', real: 18200, predicho: 18000, limiteInferior: 15500, limiteSuperior: 20500, volumenVentasCredito: 20000 },
  { fecha: '2026-04-15', real: 21500, predicho: 20900, limiteInferior: 18000, limiteSuperior: 23500, volumenVentasCredito: 25000 },
  { fecha: '2026-04-25', real: 17400, predicho: 17900, limiteInferior: 15000, limiteSuperior: 20500, volumenVentasCredito: 18000 },
  // Mayo 2026
  { fecha: '2026-05-05', real: 19000, predicho: 19200, limiteInferior: 16500, limiteSuperior: 22000, volumenVentasCredito: 22000 },
  { fecha: '2026-05-15', real: 22100, predicho: 22000, limiteInferior: 19000, limiteSuperior: 25000, volumenVentasCredito: 27000 },
  { fecha: '2026-05-25', real: 16200, predicho: 18500, limiteInferior: 16000, limiteSuperior: 21000, volumenVentasCredito: 19000 },
  // Junio 2026
  { fecha: '2026-06-05', real: 20500, predicho: 20100, limiteInferior: 17500, limiteSuperior: 23000, volumenVentasCredito: 24000 },
  { fecha: '2026-06-15', real: 23800, predicho: 23200, limiteInferior: 20500, limiteSuperior: 26000, volumenVentasCredito: 29000 },
  { fecha: '2026-06-25', real: 19100, predicho: 19500, limiteInferior: 17000, limiteSuperior: 22000, volumenVentasCredito: 21000 },
  
  // PROYECCIÓN PROPHET (A partir de Julio 2026, fecha actual es 10 Julio 2026)
  // 15 días (Proyecciones de Julio)
  { fecha: '2026-07-05', real: 21200, predicho: 21000, limiteInferior: 18500, limiteSuperior: 23500, volumenVentasCredito: 25000 },
  { fecha: '2026-07-15', real: null, predicho: 24500, limiteInferior: 21000, limiteSuperior: 28000, volumenVentasCredito: 31000 },
  { fecha: '2026-07-25', real: null, predicho: 20200, limiteInferior: 17000, limiteSuperior: 23500, volumenVentasCredito: 22000 },
  // 30 días (Proyecciones de Agosto)
  { fecha: '2026-08-05', real: null, predicho: 22100, limiteInferior: 18500, limiteSuperior: 25500, volumenVentasCredito: 26500 },
  { fecha: '2026-08-15', real: null, predicho: 25800, limiteInferior: 22000, limiteSuperior: 29500, volumenVentasCredito: 32000 },
  { fecha: '2026-08-25', real: null, predicho: 18900, limiteInferior: 15000, limiteSuperior: 22500, volumenVentasCredito: 20000 },
  // 60 días (Proyecciones de Septiembre)
  { fecha: '2026-09-05', real: null, predicho: 23400, limiteInferior: 19000, limiteSuperior: 27500, volumenVentasCredito: 28000 },
  { fecha: '2026-09-15', real: null, predicho: 27100, limiteInferior: 23000, limiteSuperior: 31000, volumenVentasCredito: 34000 },
  { fecha: '2026-09-25', real: null, predicho: 19800, limiteInferior: 15500, limiteSuperior: 24000, volumenVentasCredito: 21000 },
  // 90 días (Proyecciones de Octubre)
  { fecha: '2026-10-05', real: null, predicho: 24500, limiteInferior: 19500, limiteSuperior: 29500, volumenVentasCredito: 30000 },
  { fecha: '2026-10-15', real: null, predicho: 28900, limiteInferior: 23500, limiteSuperior: 34000, volumenVentasCredito: 36000 },
  { fecha: '2026-10-25', real: null, predicho: 21100, limiteInferior: 16000, limiteSuperior: 26000, volumenVentasCredito: 23000 }
];

// Configuración por defecto de los modelos para simulación
export const CONFIG_DEFECTO_MOCK: ConfigModelos = {
  prophet: {
    periodoProyeccion: 30,
    estacionalidadAnual: true,
    estacionalidadSemanal: true,
    tipoCrecimiento: 'linear',
    flexibilidadCambio: 0.05
  },
  scikitLearn: {
    umbralRiesgoMora: 70,
    variablesSeleccionadas: ['monto_factura', 'historial_retraso', 'categoria_fiscal', 'dias_vencidos', 'tipo_repuesto_adquirido'],
    metodoScoring: 'RandomForest'
  },
  pySpark: {
    frecuenciaProcesamiento: 'Semanal',
    clustersClientes: 3,
    fuentesDatos: ['erp_cuentas_cobrar', 'ventas_inventario_repuestos', 'pagos_bancarios_historicos']
  }
};

// Alertas tempranas generadas por los modelos ML
export const ALERTAS_MOCK: AlertaFlujo[] = [
  {
    id: 'ALT-01',
    tipo: 'Critica',
    titulo: 'Peligro de Liquidez Estimado en Día 45',
    descripcion: 'El modelo Prophet proyecta que los egresos por importaciones programadas superarán la cobranza recuperable acumulada, dejando una brecha de liquidez de $12,500.',
    fecha: '2026-07-10',
    leida: false
  },
  {
    id: 'ALT-02',
    tipo: 'Advertencia',
    titulo: 'Alta Concentración de Riesgo de Mora (Socio C)',
    descripcion: 'El modelo Random Forest clasifica a "Autoservicios del Sur S.A." con un 58% de probabilidad de impago crónico. Se recomienda suspender crédito para despacho de amortiguadores.',
    fecha: '2026-07-08',
    leida: false
  },
  {
    id: 'ALT-03',
    tipo: 'Informativa',
    titulo: 'Recalibración de Estacionalidad de Prophet Exitosa',
    descripcion: 'Se integró la estacionalidad de compra de repuestos de mantenimiento invernal de Julio. El error medio absoluto (MAE) del modelo bajó a 4.2%.',
    fecha: '2026-07-09',
    leida: true
  },
  {
    id: 'ALT-04',
    tipo: 'Advertencia',
    titulo: 'Aceleración del Ciclo DSO (Days Sales Outstanding)',
    descripcion: 'El ciclo medio de cobranza real subió de 32 a 39 días en las últimas dos semanas para repuestos de colisión. El flujo proyectado se verá afectado en 15 días.',
    fecha: '2026-07-07',
    leida: false
  }
];
