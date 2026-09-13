/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { CuentaPorCobrar, PuntoPrediccion, ConfigModelos, AlertaFlujo } from '../types';
import { PUNTOS_PREDICCION_MOCK, ALERTAS_MOCK } from '../data/mockData';
import { 
  ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import { 
  LayoutGrid, Calendar, Sliders, TrendingUp, AlertCircle, Sparkles, 
  ArrowUpRight, ArrowDownRight, Users, Box, AlertTriangle, ShieldCheck
} from 'lucide-react';

interface Props {
  cuentas: CuentaPorCobrar[];
  config: ConfigModelos;
}

export default function DashboardLayouts({ cuentas, config }: Props) {
  const [activeLayout, setActiveLayout] = useState<'A' | 'B' | 'C'>('B');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('todos'); // todos, 15, 30, 60, 90
  const [riskSlider, setRiskSlider] = useState<number>(30); // Simulación "What-If" para retraso de clientes de alto riesgo
  const [inventoryLink, setInventoryLink] = useState<boolean>(true); // Activar/desactivar link rotación inventario en predicción

  // Alertas dinámicas
  const [alertas, setAlertas] = useState<AlertaFlujo[]>(ALERTAS_MOCK);

  // 1. Filtrar puntos de predicción de Prophet de acuerdo al periodo seleccionado
  const filteredPredictionData = useMemo(() => {
    // La fecha de separación es '2026-07-10'
    const today = new Date('2026-07-10');
    
    let rawPoints = PUNTOS_PREDICCION_MOCK.map(pt => {
      const ptDate = new Date(pt.fecha);
      const isFuture = ptDate > today;
      
      let predValue = pt.predicho;
      
      // Simulación What-If interactiva:
      // Si el usuario simula un retraso de cobranza de alto riesgo (con el slider), 
      // afectamos el flujo predictivo futuro restándole un porcentaje de cobranzas.
      if (isFuture) {
        // Reducir la predicción de caja en función del riesgo simulado (What-If)
        const penalizacion = (riskSlider - 30) * 120;
        predValue = Math.max(pt.predicho - penalizacion, pt.limiteInferior - 500);
      }

      return {
        ...pt,
        predicho: Math.round(predValue),
        // Sincronizar límites en base a la simulación What-If
        limiteSuperior: Math.round(pt.limiteSuperior - ((riskSlider - 30) * 40)),
        limiteInferior: Math.round(pt.limiteInferior - ((riskSlider - 30) * 180)),
      };
    });

    if (selectedPeriod === 'todos') {
      return rawPoints;
    }

    const maxDays = Number(selectedPeriod);
    const futureLimit = new Date('2026-07-10');
    futureLimit.setDate(futureLimit.getDate() + maxDays);

    return rawPoints.filter(pt => {
      const ptDate = new Date(pt.fecha);
      // Mostrar históricos y futuro hasta el límite seleccionado (15, 30, 60, 90 días)
      if (ptDate <= today) {
        // Para no congestionar, dejamos últimos 3 meses históricos
        const minDate = new Date('2026-04-01');
        return ptDate >= minDate;
      }
      return ptDate <= futureLimit;
    });
  }, [selectedPeriod, riskSlider]);

  // 2. Cálculos dinámicos de KPIs basados en las facturas y el estado actual
  const kpis = useMemo(() => {
    // DSO (Days Sales Outstanding) = (Cuentas por Cobrar / Ventas a Crédito Totales) * 365
    // Simulamos DSO basado en los días de retraso estimación
    const totalCxC = cuentas.reduce((acc, c) => acc + (c.estado !== 'Pagado' ? c.monto : 0), 0);
    const pagados = cuentas.reduce((acc, c) => acc + (c.estado === 'Pagado' ? c.monto : 0), 0);
    const totalVentasCredito = totalCxC + pagados;
    
    // DSO promedio ponderado real/pronosticado
    const sumaPonderadaDias = cuentas.reduce((acc, c) => acc + (c.estado !== 'Pagado' ? (c.monto * c.diasRetrasoEstimado) : 0), 0);
    const dsoEstimado = Math.round(30 + (sumaPonderadaDias / (totalCxC || 1)));

    // Rotación de Inventario vinculada al crédito (%)
    // En repuestos, alta rotación vs crédito: lo simulamos con un indicador de stock en riesgo
    const amortiguadoresYBalatasCredito = cuentas.filter(c => c.categoriaCliente === 'C').reduce((acc, c) => acc + c.monto, 0);
    const rotacionVulnerableCredito = Math.round((amortiguadoresYBalatasCredito / (totalCxC || 1)) * 100);

    // Saldo neto proyectado por Prophet al final del periodo seleccionado
    const ultimoPunto = filteredPredictionData[filteredPredictionData.length - 1];
    const cajaProyectada = ultimoPunto ? ultimoPunto.predicho : 24000;
    const cajaHistoricaActual = 21200; // Al 5 de Julio
    const variacionCaja = cajaProyectada - cajaHistoricaActual;

    // Morosidad promedio
    const moraTotal = cuentas.filter(c => c.estado === 'En Mora' || c.estado === 'Vencido').reduce((acc, c) => acc + c.monto, 0);
    const tasaMora = Math.round((moraTotal / (totalCxC || 1)) * 100);

    return {
      totalCxC,
      dsoEstimado,
      rotacionVulnerableCredito,
      cajaProyectada,
      variacionCaja,
      tasaMora
    };
  }, [cuentas, filteredPredictionData]);

  // Datos para el gráfico de dispersión de Clustering de PySpark (Layout C)
  const scatterData = useMemo(() => {
    // Relaciona Volumen de Compra Acumulado ($) con Probabilidad de Mora (%)
    // Generados en clusters: Cluster 0 (Bajo Riesgo, Alto Volumen), Cluster 1 (Riesgo Medio, Volumen Bajo), Cluster 2 (Alto Riesgo, Volúmenes variables)
    return cuentas.map(c => {
      let cluster = 0;
      if (c.categoriaCliente === 'A') cluster = 0; // VIP / Bajo riesgo
      else if (c.categoriaCliente === 'B') cluster = 1; // Estándar
      else cluster = 2; // Crítico / Alto riesgo

      return {
        cliente: c.cliente,
        volumen: c.monto * (cluster === 0 ? 1.8 : cluster === 1 ? 0.9 : 0.6),
        probabilidadMora: Math.round(100 - c.probabilidadPago),
        cluster,
        factura: c.factura
      };
    });
  }, [cuentas]);

  // Marcar alerta como leída
  const handleReadAlerta = (id: string) => {
    setAlertas(prev => prev.map(a => a.id === id ? { ...a, leida: true } : a));
  };

  return (
    <div id="dashboard-layouts-panel" className="space-y-6">
      
      {/* 1. Selector de Layout y Filtro Temporal Global */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Selector de Layout */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mr-2">
            <LayoutGrid className="w-4 h-4 text-blue-600" /> Esquema Visual UI:
          </span>
          <div className="inline-flex p-1 bg-gray-100 rounded-lg">
            <button
              id="layout-btn-a"
              onClick={() => setActiveLayout('A')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeLayout === 'A' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Opción A: ERP Tradicional
            </button>
            <button
              id="layout-btn-b"
              onClick={() => setActiveLayout('B')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeLayout === 'B' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Opción B: ML-First (Prophet)
            </button>
            <button
              id="layout-btn-c"
              onClick={() => setActiveLayout('C')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeLayout === 'C' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Opción C: Bento Grid BI
            </button>
          </div>
        </div>

        {/* Panel de Filtro Temporal - Solicitud de Tesis */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-gray-500">Período de Tiempo (Prophet):</span>
          <select
            id="select-time-period-filter"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-gray-800 font-bold focus:outline-hidden cursor-pointer"
          >
            <option value="todos">Todos los Datos (Historico + Proyeccion)</option>
            <option value="15">Próximos 15 Días (Proyección Prophet Julio)</option>
            <option value="30">Próximos 30 Días (Siguiente Mes Completo)</option>
            <option value="60">Próximos 60 Días (Medio Plazo a Septiembre)</option>
            <option value="90">Próximos 90 Días (Predicción Completa a Octubre)</option>
          </select>
        </div>
      </div>

      {/* 2. Sección del Layout Activo */}
      
      {/* OPCIÓN A: ERP TRADICIONAL (Orientado a la operación clásico, tablas, barras reales vs esperados) */}
      {activeLayout === 'A' && (
        <div id="layout-erp-traditional" className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Columna Izquierda: Métricas e Históricos de Facturación */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs space-y-4">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-sm">Flujo de Caja Real vs Proyectado a Corto Plazo</h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">plotly.go.BarChart</span>
              </div>
              
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredPredictionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                      formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar name="Flujo Real" dataKey="real" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                    <Bar name="Predicción Prophet" dataKey="predicho" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-gray-400 italic text-center">
                * Las barras de Flujo Real se extinguen al llegar al presente (10 Julio 2026), siendo continuadas secuencialmente por las proyecciones de Prophet.
              </p>
            </div>

            {/* Tabla interactiva ERP de cuentas corrientes */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <h3 className="font-bold text-gray-900 text-sm">Visor de Cuentas por Cobrar (Sincronización ERP)</h3>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">dash_table.DataTable</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-semibold sticky top-0 border-b border-gray-100">
                    <tr>
                      <th className="p-2.5">Factura</th>
                      <th className="p-2.5">Cliente</th>
                      <th className="p-2.5 text-right">Monto</th>
                      <th className="p-2.5">Vence</th>
                      <th className="p-2.5">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cuentas.slice(0, 6).map(c => (
                      <tr key={c.id} className="hover:bg-gray-50/50">
                        <td className="p-2.5 font-mono font-medium text-gray-900">{c.factura}</td>
                        <td className="p-2.5 text-gray-700">{c.cliente}</td>
                        <td className="p-2.5 text-right font-mono font-bold">${c.monto.toLocaleString()}</td>
                        <td className="p-2.5 text-gray-500">{c.fechaVencimiento}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                            c.estado === 'Pagado' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {c.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjetas de control y Alertas */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs space-y-4">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">KPIs Operativos</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Cartera Total CxC</span>
                  <div className="text-xl font-bold text-gray-900 mt-0.5">${kpis.totalCxC.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">DSO Promedio (Ventas a Crédito)</span>
                  <div className="text-xl font-bold text-gray-900 mt-0.5">{kpis.dsoEstimado} Días</div>
                  <span className="text-[9px] text-amber-600 block mt-1">Sugerido para PYME: Menor a 35 días.</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Índice de Morosidad</span>
                  <div className="text-xl font-bold text-gray-900 mt-0.5">{kpis.tasaMora}%</div>
                </div>
              </div>
            </div>

            {/* Alertas sencillas */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs space-y-4">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">Bandeja de Alertas</h3>
              <div className="space-y-2.5">
                {alertas.slice(0, 2).map(a => (
                  <div key={a.id} className="p-2.5 rounded-lg border border-gray-150 text-xs bg-gray-50">
                    <div className="flex items-center gap-1 font-semibold text-gray-800">
                      {a.tipo === 'Critica' ? <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{a.titulo}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{a.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* OPCIÓN B: ML-FIRST & PROYECCIÓN (Gráfico gigante de Prophet con bandas de confianza, simulación What-If) */}
      {activeLayout === 'B' && (
        <div id="layout-ml-first" className="space-y-6 animate-fadeIn">
          
          {/* Tarjetas de Indicadores Rápidos con micrográficos de tendencia */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Caja Proyectada</span>
                <div className="text-xl font-extrabold text-gray-950 mt-1">${kpis.cajaProyectada.toLocaleString()}</div>
                <span className={`text-[10px] font-semibold mt-1 inline-flex items-center gap-0.5 ${
                  kpis.variacionCaja >= 0 ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {kpis.variacionCaja >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{kpis.variacionCaja >= 0 ? '+' : ''}${kpis.variacionCaja.toLocaleString()}</span>
                </span>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">DSO Pronosticado (AI)</span>
                <div className="text-xl font-extrabold text-gray-950 mt-1">{kpis.dsoEstimado} Días</div>
                <span className="text-[9px] text-gray-500 block mt-1">Calculado por Regresión</span>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Stock en Riesgo de Mora</span>
                <div className="text-xl font-extrabold text-gray-950 mt-1">{kpis.rotacionVulnerableCredito}%</div>
                <span className="text-[9px] text-gray-500 block mt-1">Repuestos de colisión/motor</span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
                <Box className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Tasa de Impago Crónico</span>
                <div className="text-xl font-extrabold text-gray-950 mt-1">{kpis.tasaMora}%</div>
                <span className="text-[9px] text-red-500 font-semibold block mt-1">Riesgo Alto</span>
              </div>
              <div className="p-3 bg-red-50 text-red-600 rounded-full">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Gráfico Central Prophet de alta gama */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-3 gap-2">
              <div>
                <h3 className="font-bold text-gray-950 text-base flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Proyecciones de Serie Temporal de Flujo de Caja (Modelo Prophet)
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Muestra la tendencia suavizada histórica y las bandas de incertidumbre (80% confidence intervals)</p>
              </div>
              <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-mono font-bold">
                plotly.graph_objects.Scatter + Fill
              </span>
            </div>

            <div className="h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredPredictionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  
                  {/* Bandas de confianza Prophet */}
                  <Area 
                    name="Prophet Intervalo Superior" 
                    dataKey="limiteSuperior" 
                    stroke="none" 
                    fill="#c084fc" 
                    fillOpacity={0.15} 
                  />
                  <Area 
                    name="Prophet Intervalo Inferior" 
                    dataKey="limiteInferior" 
                    stroke="none" 
                    fill="#c084fc" 
                    fillOpacity={0.15} 
                  />

                  {/* Curva de flujo real */}
                  <Line 
                    name="Flujo Real ($)" 
                    dataKey="real" 
                    stroke="#1e293b" 
                    strokeWidth={2.5} 
                    dot={{ r: 3 }} 
                    activeDot={{ r: 5 }} 
                  />

                  {/* Proyección Prophet */}
                  <Line 
                    name="Proyección Predictiva Prophet" 
                    dataKey="predicho" 
                    stroke="#8b5cf6" 
                    strokeWidth={2.5} 
                    strokeDasharray="4 4"
                    dot={false} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-gray-400 italic text-center">
              * El área sombreada en morado translúcido denota el margen probabilístico de incertidumbre de Prophet. A mayor horizonte (90 días), la banda de incertidumbre se ensancha naturalmente.
            </p>
          </div>

          {/* Panel Interactivo de Simulación "What-If" */}
          <div className="bg-purple-950 text-purple-100 p-5 rounded-xl border border-purple-900 shadow-md">
            <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Simulador "What-If" Dinámico para Defensa de Tesis
            </h4>
            <p className="text-xs text-purple-200 leading-relaxed mb-4">
              Ajusta los controles interactivos para simular el impacto en tiempo real del retraso de pagos de clientes Categoría C (alto riesgo) sobre el Flujo de Caja y ve cómo se contrae o expande la curva predictiva de Prophet de forma inmediata:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Retraso Estimado de Clientes con Score Crítico (Categoría C):</span>
                  <span className="text-purple-300 font-mono">+{riskSlider} Días</span>
                </div>
                <input
                  id="slider-whatif-risk"
                  type="range"
                  min="30"
                  max="90"
                  step="5"
                  value={riskSlider}
                  onChange={(e) => setRiskSlider(Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-purple-300">
                  <span>30 Días (Estándar)</span>
                  <span>90 Días (Estrangulamiento)</span>
                </div>
              </div>

              <div className="bg-purple-900/40 p-4 rounded-lg border border-purple-800/60 text-xs flex flex-col justify-center space-y-1">
                <span className="font-bold text-white">Análisis de Sensibilidad de IA:</span>
                <p className="text-[11px] text-purple-200">
                  {riskSlider > 60 
                    ? '⚠️ CRÍTICO: Un retraso de +' + riskSlider + ' días en repuestos de alta rotación provocará una brecha de liquidez severa que obligará a solicitar financiamiento bancario en el Día 45.'
                    : '✔️ CONTROLADO: El retraso simulado se mantiene dentro del fondo de contingencias financieras de Aiko Repuestos. No hay riesgo de ruptura de flujo.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* OPCIÓN C: BENTO GRID DE INTELIGENCIA DE NEGOCIOS (BI) */}
      {activeLayout === 'C' && (
        <div id="layout-bento-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Tarjeta 1: DSO Sparkline (Bento Card) */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs space-y-4">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Ciclo de Cobro DSO</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900">{kpis.dsoEstimado}</span>
              <span className="text-xs text-gray-500 font-medium">Días Promedio</span>
            </div>
            <div className="h-10">
              {/* Micro Sparkline */}
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredPredictionData.slice(-10)}>
                  <Line dataKey="volumenVentasCredito" stroke="#10b981" strokeWidth={2.5} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Optimizado por Clustering de PySpark</span>
            </div>
          </div>

          {/* Tarjeta 2: Tasa de Mora & Score K-Means (Bento Card) */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs space-y-4">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Riesgo Global de Cartera</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-600">{kpis.tasaMora}%</span>
              <span className="text-xs text-gray-500 font-medium">De Mora Estimada</span>
            </div>
            <div className="h-10">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredPredictionData.slice(-10)}>
                  <Line dataKey="limiteSuperior" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              * Facturas concentradas en clientes de categoría fiscal C (concesionarios con pago a 60 días).
            </p>
          </div>

          {/* Tarjeta 3: Alertas Dinámicas (Bento Card de alta visibilidad) */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2">Feed de Alertas Predictivas</span>
              <div className="space-y-2">
                {alertas.map(a => (
                  <div key={a.id} className={`p-2 rounded-lg border flex items-start gap-2 text-xs transition-opacity ${
                    a.leida ? 'bg-gray-50/50 border-gray-100 opacity-60' : 'bg-red-50/50 border-red-100'
                  }`}>
                    <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${a.tipo === 'Critica' ? 'text-red-500' : 'text-amber-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{a.titulo}</div>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{a.descripcion}</p>
                    </div>
                    {!a.leida && (
                      <button 
                        onClick={() => handleReadAlerta(a.id)}
                        className="text-[9px] text-blue-600 font-semibold hover:underline shrink-0"
                      >
                        Leído
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[9px] text-gray-400 text-center block pt-2 border-t border-gray-50">Alertas calculadas por Scikit-learn (RandomForest)</span>
          </div>

          {/* Tarjeta de Ancho Completo: PySpark Scatter plot de Riesgo por Cliente */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs md:col-span-3 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-950 text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  Mapeo de Clientes: Volumen de Crédito vs Probabilidad de Mora (PySpark Clustering)
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Agrupados por comportamiento transaccional utilizando K-Means en Spark</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold">
                plotly.express.scatter (4 Cuadrantes)
              </span>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    type="number" 
                    dataKey="volumen" 
                    name="Volumen de Crédito" 
                    unit="USD" 
                    tick={{ fontSize: 10 }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    type="number" 
                    dataKey="probabilidadMora" 
                    name="Probabilidad de Mora" 
                    unit="%" 
                    tick={{ fontSize: 10 }}
                    stroke="#9ca3af"
                  />
                  <ZAxis type="category" dataKey="cliente" name="Cliente" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Scatter name="Talleres y Distribuidores" data={scatterData} fill="#8884d8">
                    {scatterData.map((entry, index) => {
                      // Color según el cluster calculado por PySpark K-Means
                      const colors = [
                        '#10b981', // Cluster 0: Alto Volumen, Bajo Riesgo (Verde)
                        '#f59e0b', // Cluster 1: Volumen Medio, Riesgo Medio (Naranja)
                        '#ef4444'  // Cluster 2: Alto Riesgo, Bajo Volumen (Rojo)
                      ];
                      return <Cell key={`cell-${index}`} fill={colors[entry.cluster]} />;
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            {/* Leyenda de los Clusters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-2 p-2 bg-emerald-50/50 rounded-lg border border-emerald-100 text-emerald-800">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="font-semibold">Cluster 0 (Premium):</span>
                <span>Alto volumen, excelente cumplimiento fiscal.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-amber-50/50 rounded-lg border border-amber-100 text-amber-800">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="font-semibold">Cluster 1 (Estándar):</span>
                <span>Talleres multimarca con retraso controlado (DSO &lt; 40).</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-red-50/50 rounded-lg border border-red-100 text-red-800">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="font-semibold">Cluster 2 (Riesgo Crítico):</span>
                <span>Concesionarios morosos con alta dispersión de pago.</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
