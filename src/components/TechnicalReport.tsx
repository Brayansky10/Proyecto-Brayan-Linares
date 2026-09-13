/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, Download, CheckCircle, XCircle, Layers, Activity } from 'lucide-react';

export default function TechnicalReport() {
  const downloadReport = () => {
    const element = document.createElement("a");
    const reportText = `INFORME TÉCNICO DE TESIS: SISTEMA INTEGRADO DE PREDICCIÓN Y MANTENIMIENTO DEL FLUJO DE CAJA (AIKO REPUESTOS)
==================================================================================================
Autor: Tesis de Grado - Ingeniería de Sistemas / Finanzas
Fecha: Julio 2026

1. QUÉ DEBE LLEVAR EL SISTEMA (Inclusiones Obligatorias)
-----------------------------------------------------------
Para cumplir con el objetivo de sustituir la gestión intuitiva de Aiko Repuestos por decisiones basadas en datos, el sistema debe estructurarse en tres pilares lógicos:

A. Registros Base (Flujo Tradicional y Cuentas por Cobrar)
   - Módulo de Cuentas por Cobrar (CxC): Base de datos estructurada con campos como Cliente, Número de Factura, Fecha de Emisión, Fecha de Vencimiento, Monto Total, Estado (Pendiente, Pagado, Vencido, Mora) y Categoría Tributaria.
   - Flujo de Caja Histórico Real: Registro de entradas de efectivo (ventas al contado, cobranzas efectivas) y salidas (compras a proveedores de repuestos, gastos operativos, salarios, servicios fijos).

B. Configuración y Activación de Modelos Predictivos (IA/ML)
   - Configuración de Prophet (Proyección de Series Temporales): Interfaz para parametrizar el modelo a 15, 30, 60 y 90 días, activando estacionalidades (anual/semanal) y regulando la flexibilidad de los puntos de cambio (changepoints).
   - Scoring Crediticio (Scikit-Learn): Algoritmo de clasificación (Random Forest/XGBoost) entrenado para evaluar perfiles de clientes de repuestos y calcular la probabilidad de impago/mora para cada factura emitida.
   - Procesamiento de Datos (Pandas & PySpark): Pipeline de ETL para limpieza de datos históricos y agrupamiento (K-Means) de clientes por volumen de compra y comportamiento de pago.

C. Visualizador de KPIs y Proyecciones Predictivas
   - Gráfico de Proyección de Flujo de Caja (con Prophet): Gráfico central de líneas con intervalos de confianza de Prophet (límite superior e inferior) que proyecte a 15, 30, 60 y 90 días.
   - KPIs de Gestión Financiera y de Inventario:
     * Days Sales Outstanding (DSO): DSO = (Cuentas por Cobrar / Ventas a Crédito Totales) * 365
     * Rotación de Inventario vinculada al Crédito: Índice que analiza qué repuestos de alta rotación (ej. filtros, balatas) se venden a crédito frente a los de baja rotación.
     * Índice de Morosidad: % de cartera vencida sobre el total por cobrar.
     * Brecha de Liquidez (Liquidity Gap): Diferencia entre ingresos esperados y egresos programados.

D. Alertas Tempranas Inteligentes
   - Alerta de Liquidez Crítica: Notificación cuando el flujo de caja neto predictivo descienda por debajo de la reserva mínima operativa.
   - Alerta de Riesgo por Cliente: Bloqueo sugerido o condiciones restrictivas automáticas cuando un cliente cruza el umbral de riesgo de mora (e.g., > 70% de probabilidad de impago).


2. QUÉ NO DEBE LLEVAR EL SISTEMA (Exclusiones Clave para una PYME)
---------------------------------------------------------------------
Para evitar el sobre-diseño y mantener el proyecto acotado al alcance predictivo de liquidez para una PYME, se excluyen las siguientes funcionalidades:

A. Contabilidad de Partida Doble Integral: El sistema no debe generar Balances Generales complejos, Estados de Pérdidas y Ganancias (P&G) contables, ni libros diarios de asientos. Su enfoque es puramente el Flujo de Caja (Caja/Liquidez) y no la devengación contable.
B. Facturación Electrónica y Conexión Tributaria Directa: El software no necesita emitir timbrados ni comunicarse con entes recaudadores en tiempo real. Los datos de ventas se asumen ya ingresados vía ERP o cargados en PostgreSQL mediante un ETL programado.
C. Gestión Multialmacén y Control de Inventario Físico (WMS): No se requiere control de pasillos, picking o inventario físico detallado. Solo se asocian las métricas financieras básicas de rotación de inventario con los plazos de crédito otorgados.
D. Pasarelas de Pago Integradas con Conciliación Automática: No se implementa cobro mediante APIs bancarias ni Stripe/PayPal directos. La conciliación de pagos se realiza mediante la carga de estados de cuenta o interfaces de usuario sencillas.


3. OPCIONES DE DISEÑO UX/UI (Layouts para Dash / Plotly)
------------------------------------------------------------
Propuesta de tres esquemas visuales interactivos adaptados al ecosistema de Dash:

Opción A: Layout "Enfoque ERP Tradicional" (Orientado a Operaciones)
   - Estructura: Barra lateral izquierda para filtros de fecha y carga de archivos CSV. Panel central dividido horizontalmente.
   - Visuales: Arriba, una tabla interactiva (Dash DataTable) con el histórico real de cuentas por cobrar. Abajo, un gráfico de barras apiladas de Plotly Go que muestra ingresos versus egresos reales, con una línea punteada que extiende las predicciones de Prophet a 30 días de forma tímida.
   - Vibe: Estilo sobrio, colores clásicos (azul financiero y gris), ideal para contadores acostumbrados a sistemas tipo SAP o ERPs legacy.

Opción B: Layout "ML-First & Simulación Proyectiva" (Orientado a la Estrategia de IA)
   - Estructura: Diseño de ancho completo (Full Width) sin paneles laterales. Control de pestañas superior para horizontes de tiempo (15, 30, 60 y 90 días) y sliders interactivos de simulación "What-If" en un panel colapsable.
   - Visuales: Un gráfico gigante de Plotly (Line + Area) con la proyección de Prophet. Utiliza curvas suaves con zonas sombreadas translúcidas que denotan el intervalo de confianza (80% y 95%). Tarjetas indicadoras de IA con métricas de precisión (MAE, RMSE) y un score de riesgo del cliente de Scikit-Learn mediante un Gauge Chart (gráfico de tacómetro).
   - Vibe: Estilo moderno, tema oscuro sofisticado, uso de gradientes e interacción dinámica con variables del modelo de Machine Learning en vivo.

Opción C: Layout "Bento Grid de Inteligencia de Negocios (BI)" (Orientado a la Gerencia)
   - Estructura: Cuadrícula responsiva (Grid de CSS de 12 columnas) que organiza tarjetas independientes de información ("Bento Box"). Filtros unificados en la cabecera.
   - Visuales: Tarjetas interactivas con indicadores numéricos grandes y micro-gráficos de tendencia (Sparklines) de Plotly Express. Gráficos de dispersión (Scatter Plot) en 4 cuadrantes relacionando Volumen de Crédito contra Probabilidad de Mora de los Clientes (Clustering de PySpark). Alertas tempranas en un feed lateral animado de alta visibilidad.
   - Vibe: Estilo minimalista, fondo blanco con sombras suaves, colores de acento claros (verde esmeralda para liquidez segura, ámbar para atención, y carmín para riesgo severo). Enfoque directo en la rápida toma de decisiones gerenciales.
`;

    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "informe_tecnico_tesis_flujo_caja.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div id="technical-report-container" className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header del informe */}
      <div id="report-header" className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-3">
            <Layers className="w-3 h-3" /> Tesis de Grado: Aiko Repuestos
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Informe Técnico de Arquitectura y Diseño UX/UI
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Estructuración del Sistema de Predicción y Mantenimiento de Flujo de Caja
          </p>
        </div>
        <button
          id="btn-download-report"
          onClick={downloadReport}
          className="mt-4 md:mt-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Informe .txt</span>
        </button>
      </div>

      {/* Grid de Secciones */}
      <div id="report-body" className="space-y-10 font-sans text-gray-700 leading-relaxed text-sm md:text-base">
        
        {/* Sección 1 */}
        <section id="section-inclusions" className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 border-l-4 border-emerald-500 pl-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg md:text-xl font-bold">1. QUÉ DEBE LLEVAR EL SISTEMA (Inclusiones Obligatorias)</h2>
          </div>
          <p className="text-gray-600">
            Para cumplir con el objetivo de sustituir la gestión intuitiva de <strong>Aiko Repuestos</strong> por decisiones basadas en datos financieros e inteligencia artificial, el sistema gerencial se divide en cuatro módulos lógicos y funcionales altamente integrados:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-950 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                A. Registros Base (Flujo Tradicional)
              </h3>
              <p className="text-xs text-gray-600 space-y-1">
                Sustenta los datos reales. Mantiene las <strong>Cuentas por Cobrar (CxC)</strong> con fechas de emisión y vencimiento, montos netos, estados fiscales y registros tradicionales de ingresos (ventas de contado, cobranzas) y egresos (pagos a proveedores de repuestos como Koyo, gastos fijos y nómina).
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-950 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                B. Configuración de Modelos (IA/ML)
              </h3>
              <p className="text-xs text-gray-600 space-y-1">
                La consola de control de algoritmos: <strong>Prophet</strong> para series temporales con estacionalidades (anual/semanal) a 15, 30, 60 y 90 días; clasificación con <strong>Scikit-Learn (Random Forest)</strong> para calcular la probabilidad de mora por cliente; y un motor ETL de <strong>Pandas/PySpark</strong> para segmentar perfiles mediante clusters de K-Means.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-950 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                C. Visualizador e Interactividad de KPIs
              </h3>
              <p className="text-xs text-gray-600 space-y-1">
                Gráficos de proyección central de líneas de Plotly con las bandas de confianza de Prophet, filtros dinámicos de horizonte temporal y KPIs críticos:
                <br />
                <code className="block bg-gray-200 p-1 rounded font-mono my-1.5 text-center text-gray-800 text-[11px]">
                  DSO = (Cuentas por Cobrar / Ventas a Crédito) × 365
                </code>
                Rotación de inventario asociada al crédito, índice de cartera vencida y brecha de liquidez proyectada.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-950 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                D. Alertas Tempranas Predictivas
              </h3>
              <p className="text-xs text-gray-600 space-y-1">
                Disparadores basados en anomalías de caja e insolvencias de clientes. Genera alertas de <strong>Riesgo Crítico de Caja</strong> (cuando el saldo cae por debajo del stock mínimo operativo) y alertas de <strong>Mora de Clientes</strong> (recomendación automática de bloqueo de despachos a talleres).
              </p>
            </div>
          </div>
        </section>

        {/* Sección 2 */}
        <section id="section-exclusions" className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 border-l-4 border-red-500 pl-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg md:text-xl font-bold">2. QUÉ NO DEBE LLEVAR EL SISTEMA (Exclusiones Prácticas)</h2>
          </div>
          <p className="text-gray-600">
            Para asegurar la viabilidad del proyecto de tesis dentro de las restricciones de recursos de una PYME de repuestos, y evitar un alcance infinito, es vital delimitar el sistema. Se excluyen estrictamente las siguientes funciones operativas y contables que pertenecen a un ERP completo y no a un sistema de Inteligencia de Negocios (BI) predictivo:
          </p>
          
          <div className="border border-red-100 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-red-50/50 text-red-900 border-b border-red-100">
                <tr>
                  <th className="p-3 font-semibold">Funcionalidad Excluida</th>
                  <th className="p-3 font-semibold">Razón del Descarte (Foco en Pyme)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                <tr>
                  <td className="p-3 font-medium text-gray-900">Contabilidad Integral de Partida Doble</td>
                  <td className="p-3">El sistema se enfoca en el flujo neto de efectivo (caja). No requiere generar Balance General, Estados de Pérdidas y Ganancias (P&G) bajo normas NIIF, ni libros diarios de asientos.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-900">Facturación Electrónica y Conexión Tributaria</td>
                  <td className="p-3">No emite facturas con validez fiscal ni se conecta con el ente recaudador estatal. Los datos de facturación se consumen de forma pasiva a través de cargas de datos procesadas.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-900">Gestión Física y Almacenamiento (WMS)</td>
                  <td className="p-3">No realiza control físico de inventario, ni layout de pasillos, ni picking de autopartes. Solo procesa métricas agregadas de rotación comercial para coordinar plazos de crédito.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-900">Pasarelas de Pago Directas</td>
                  <td className="p-3">No realiza cobro automático por tarjetas ni APIs bancarias ni Stripe. La conciliación de cobranza es simulada o cargada manualmente para evitar complejidades de seguridad PCI.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Sección 3 */}
        <section id="section-layouts" className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 border-l-4 border-blue-500 pl-3">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg md:text-xl font-bold">3. PROPUESTA DE DISEÑO UX/UI (3 Layouts en Dash/Plotly)</h2>
          </div>
          <p className="text-gray-600">
            Como consultor UX/UI, propongo tres interfaces con enfoques de interacción y despliegue de datos marcadamente distintos para que evalúes en tu marco metodológico de tesis. Cada una equilibra el histórico real y el predictivo de Prophet de diferente forma:
          </p>

          <div className="space-y-6 mt-4">
            {/* Opción A */}
            <div className="bg-blue-50/30 p-5 rounded-lg border border-blue-100/50">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">Opción A</span>
              <h3 className="font-bold text-gray-950 text-base mb-2">Diseño Tradicional Enfocado en el ERP (Operations-Oriented)</h3>
              <p className="text-xs text-gray-600 mb-3">
                <strong>Estructura:</strong> Barra de filtros lateral fija y una amplia tabla de datos interactiva en la zona central. Prioriza la gestión de registros individuales.
                <br />
                <strong>Gráficos Plotly recomendados:</strong>
              </p>
              <ul className="text-xs text-gray-600 list-disc list-inside space-y-1 pl-2">
                <li><code>plotly.express.bar()</code>: Columnas apiladas para comparar Ingresos vs Egresos del mes corriente.</li>
                <li><code>dash_table.DataTable</code>: Tabla interactiva con opción de búsqueda de facturas, paginación y exportación de datos a Excel/CSV.</li>
                <li>Línea punteada simple para la extensión predictiva del flujo a 30 días, sin intervalos complejos.</li>
              </ul>
              <p className="text-xs text-blue-700 font-semibold mt-2">Vibe: Ideal para analistas financieros y contadores tradicionales que buscan rigidez y precisión transaccional.</p>
            </div>

            {/* Opción B */}
            <div className="bg-purple-50/30 p-5 rounded-lg border border-purple-100/50">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">Opción B</span>
              <h3 className="font-bold text-gray-950 text-base mb-2">Diseño "ML-First" y Simulación Proyectiva (AI-Driven)</h3>
              <p className="text-xs text-gray-600 mb-3">
                <strong>Estructura:</strong> Dashboard de pantalla completa, controles superiores tipo "Tab" para cambiar de proyección (15, 30, 60, 90 días) y un panel lateral deslizable con barras deslizantes (sliders) para simulación dinámica de escenarios "What-If" (¿Qué pasa si Taller Nippon se retrasa 15 días?).
                <br />
                <strong>Gráficos Plotly recomendados:</strong>
              </p>
              <ul className="text-xs text-gray-600 list-disc list-inside space-y-1 pl-2">
                <li><code>plotly.graph_objects.Scatter()</code>: Líneas de flujo con área sombreada translúcida que representa el intervalo de incertidumbre (confidence bands) calculado por Prophet (upper_bound / lower_bound).</li>
                <li><code>plotly.graph_objects.Indicator()</code>: Gráfico de tacómetro (Gauge Chart) de aguja para calificar visualmente el Score de Riesgo de Mora calculado por Scikit-Learn.</li>
                <li>Línea de tendencia suavizada con cambio dinámico de color (verde para superávit, rojo para déficit predictivo).</li>
              </ul>
              <p className="text-xs text-purple-700 font-semibold mt-2">Vibe: Altamente tecnológico, tema oscuro sugerido, perfecto para mostrar el poder predictivo del algoritmo en la tesis.</p>
            </div>

            {/* Opción C */}
            <div className="bg-amber-50/30 p-5 rounded-lg border border-amber-100/50">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">Opción C</span>
              <h3 className="font-bold text-gray-950 text-base mb-2">Diseño "Bento Grid de Inteligencia de Negocios" (BI/Executive-Focused)</h3>
              <p className="text-xs text-gray-600 mb-3">
                <strong>Estructura:</strong> Distribución bento grid modular. El gerente puede ver instantáneamente el estado macro sin navegar. Filtros unificados y globales en la parte superior.
                <br />
                <strong>Gráficos Plotly recomendados:</strong>
              </p>
              <ul className="text-xs text-gray-600 list-disc list-inside space-y-1 pl-2">
                <li>Micro-gráficos de tendencia (Sparklines) rápidos de Plotly Express empotrados en tarjetas de números grandes.</li>
                <li><code>plotly.express.scatter()</code>: Gráfico de dispersión de 4 cuadrantes donde el eje X es el volumen de crédito y el eje Y es la probabilidad de mora (agrupados en clusters de K-Means de PySpark).</li>
                <li>Feed vertical de alertas dinámicas integradas en el flujo visual con colores semánticos de riesgo.</li>
              </ul>
              <p className="text-xs text-amber-700 font-semibold mt-2">Vibe: Enfoque gerencial inmediato, limpio, minimalista y responsivo. Diseñado para directores ocupados.</p>
            </div>
          </div>
        </section>

        {/* Sección de Resumen Arquitectura */}
        <section id="section-architecture-overview" className="bg-gray-900 text-gray-100 p-6 rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
            <h3 className="text-base md:text-lg font-bold text-white">Recomendación para la Implementación de Tesis</h3>
          </div>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            Para la defensa de tesis, la <strong>Opción B (ML-First) es la más recomendada</strong> para el panel de IA, combinada con la <strong>Opción C (Bento Grid) para la portada gerencial</strong>. Esto demuestra el dominio tecnológico del estudiante en Machine Learning y la utilidad para el negocio (UX). 
          </p>
          <div className="text-xs text-gray-400 bg-gray-950 p-3 rounded font-mono border border-gray-800 space-y-1">
            <div className="text-blue-400 font-bold"># Backend Pipeline Lógico de Integración de Tesis:</div>
            <div>PostgreSQL (Datos CxC) → PySpark (ETL y Clusters de Clientes K-Means) → Prophet (Modelado de Series Temporales de Caja a 90 d) → FastAPI JSON API → Dash/Plotly Interactive Client</div>
          </div>
        </section>
      </div>
    </div>
  );
}
