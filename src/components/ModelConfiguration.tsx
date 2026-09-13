/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ConfigModelos } from '../types';
import { Sliders, Cpu, Brain, Check, Database, RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  config: ConfigModelos;
  onUpdateConfig: (newConfig: ConfigModelos) => void;
}

export default function ModelConfiguration({ config, onUpdateConfig }: Props) {
  const [localConfig, setLocalConfig] = useState<ConfigModelos>({ ...config });
  const [isRetraining, setIsRetraining] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleRetrain = () => {
    setIsRetraining(true);
    setTrainingLogs([]);
    setShowSuccessToast(false);

    const logs = [
      '🔌 [FastAPI/ETL] Conectando a base de datos PostgreSQL (Aiko_DB)... OK',
      '📥 [PySpark] Extrayendo 15,420 registros de facturas y registros de flujo histórico...',
      '📈 [PySpark] Ejecutando algoritmo K-Means para agrupamiento de comportamiento de pago (Clusters = ' + localConfig.pySpark.clustersClientes + ')...',
      '🎯 [PySpark] Clusters calculados. Silhoutte Score: 0.68. Guardando labels en PostgreSQL...',
      '🤖 [Scikit-Learn] Iniciando entrenamiento de clasificación con ' + localConfig.scikitLearn.metodoScoring + '...',
      '🧪 [Scikit-Learn] Variables seleccionadas: ' + localConfig.scikitLearn.variablesSeleccionadas.join(', ') + '.',
      '📊 [Scikit-Learn] Modelo ' + localConfig.scikitLearn.metodoScoring + ' entrenado. Precisión (Accuracy): 92.4% | F1-Score: 0.89.',
      '🔮 [Prophet] Instanciando serie de tiempo Prophet con estacionalidades (Anual: ' + (localConfig.prophet.estacionalidadAnual ? 'SI' : 'NO') + ' | Semanal: ' + (localConfig.prophet.estacionalidadSemanal ? 'SI' : 'NO') + ')...',
      '🔮 [Prophet] Ajustando hiperparámetro changepoint_prior_scale a ' + localConfig.prophet.flexibilidadCambio + '...',
      '📅 [Prophet] Calculando proyecciones de flujo de caja para horizontes de 15, 30, 60 y 90 días...',
      '✅ [FastAPI] Modelos actualizados y serializados en disco en formato pickle. Métricas sincronizadas.'
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < logs.length) {
        setTrainingLogs(prev => [...prev, logs[index]]);
        index++;
      } else {
        clearInterval(interval);
        setIsRetraining(false);
        setShowSuccessToast(true);
        onUpdateConfig(localConfig);
        setTimeout(() => setShowSuccessToast(false), 4000);
      }
    }, 500);
  };

  const toggleVariable = (v: string) => {
    const current = localConfig.scikitLearn.variablesSeleccionadas;
    const next = current.includes(v) ? current.filter(x => x !== v) : [...current, v];
    setLocalConfig({
      ...localConfig,
      scikitLearn: { ...localConfig.scikitLearn, variablesSeleccionadas: next }
    });
  };

  return (
    <div id="model-configuration-container" className="space-y-6">
      
      {/* Cabecera Informativa */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-600" />
            Configuración y Activación de Modelos Predictivos (IA)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestione y parametrice los modelos de Machine Learning y Big Data que impulsan el análisis predictivo de Aiko Repuestos.
          </p>
        </div>
        <button
          id="btn-retrain-models"
          onClick={handleRetrain}
          disabled={isRetraining}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-xs transition-all cursor-pointer ${
            isRetraining ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
          <span>{isRetraining ? 'Re-entrenando...' : 'Re-entrenar Modelos (Tesis)'}</span>
        </button>
      </div>

      {/* Toast de Éxito */}
      {showSuccessToast && (
        <div id="toast-success" className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md animate-slideIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <p className="text-xs font-semibold text-emerald-800">
              ¡Modelos re-entrenados con éxito! Los parámetros se han sincronizado con las curvas de predicción del Dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Controles de Configuración en Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Prophet Section */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-gray-950 text-sm">Prophet (Series Temporales)</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Horizonte por Defecto (Días)</label>
              <select
                id="select-prophet-horizon"
                value={localConfig.prophet.periodoProyeccion}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  prophet: { ...localConfig.prophet, periodoProyeccion: Number(e.target.value) }
                })}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md font-medium text-gray-800 focus:outline-hidden"
              >
                <option value={15}>15 Días (Corto Plazo)</option>
                <option value={30}>30 Días (Siguiente Mes)</option>
                <option value={60}>60 Días (Medio Plazo)</option>
                <option value={90}>90 Días (Ciclo Completo)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Flexibilidad del Cambio (Changepoint Scale)</label>
              <div className="flex items-center gap-2">
                <input
                  id="input-prophet-changepoint"
                  type="range"
                  min="0.001"
                  max="0.5"
                  step="0.01"
                  value={localConfig.prophet.flexibilidadCambio}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    prophet: { ...localConfig.prophet, flexibilidadCambio: Number(e.target.value) }
                  })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="font-mono bg-gray-50 px-2 py-0.5 rounded text-[10px] text-gray-700 font-bold">
                  {localConfig.prophet.flexibilidadCambio}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">Valores altos capturan cambios bruscos de tendencia pero aumentan sobreajuste (overfitting).</span>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-gray-500 font-semibold mb-1">Estacionalidades Aditivas</label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="checkbox-season-annual"
                  type="checkbox"
                  checked={localConfig.prophet.estacionalidadAnual}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    prophet: { ...localConfig.prophet, estacionalidadAnual: e.target.checked }
                  })}
                  className="accent-blue-600"
                />
                <span className="text-gray-700">Activar Estacionalidad Anual</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="checkbox-season-weekly"
                  type="checkbox"
                  checked={localConfig.prophet.estacionalidadSemanal}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    prophet: { ...localConfig.prophet, estacionalidadSemanal: e.target.checked }
                  })}
                  className="accent-blue-600"
                />
                <span className="text-gray-700">Activar Estacionalidad Semanal (Días Laborales)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Scikit-Learn Section */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Brain className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-gray-950 text-sm">Scikit-Learn (Mora y Score)</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Modelo Clasificador</label>
              <select
                id="select-sk-classifier"
                value={localConfig.scikitLearn.metodoScoring}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  scikitLearn: { ...localConfig.scikitLearn, metodoScoring: e.target.value as any }
                })}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md font-medium text-gray-800 focus:outline-hidden"
              >
                <option value="RandomForest">Random Forest (Recomendado)</option>
                <option value="XGBoost">XGBoost (Alta dimensionalidad)</option>
                <option value="LogisticRegression">Regresión Logística (Explicable)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Umbral de Alerta de Riesgo</label>
              <div className="flex items-center gap-2">
                <input
                  id="input-sk-threshold"
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={localConfig.scikitLearn.umbralRiesgoMora}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    scikitLearn: { ...localConfig.scikitLearn, umbralRiesgoMora: Number(e.target.value) }
                  })}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <span className="font-mono bg-gray-50 px-2 py-0.5 rounded text-[10px] text-gray-700 font-bold">
                  {localConfig.scikitLearn.umbralRiesgoMora}%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">Probabilidad calculada que gatilla una alerta preventiva de suspensión de cuenta corriente.</span>
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1.5">Variables Predictoras Seleccionadas</label>
              <div className="grid grid-cols-1 gap-1.5">
                {['monto_factura', 'historial_retraso', 'categoria_fiscal', 'dias_vencidos', 'tipo_repuesto_adquirido'].map(v => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input
                      id={`checkbox-sk-var-${v}`}
                      type="checkbox"
                      checked={localConfig.scikitLearn.variablesSeleccionadas.includes(v)}
                      onChange={() => toggleVariable(v)}
                      className="accent-purple-600"
                    />
                    <code className="bg-gray-50 px-1 py-0.5 rounded text-[10px] text-gray-600 font-mono">{v}</code>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PySpark Section */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Database className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-gray-950 text-sm">PySpark (Clustering y ETL)</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Frecuencia de Procesamiento ETL</label>
              <select
                id="select-spark-freq"
                value={localConfig.pySpark.frecuenciaProcesamiento}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  pySpark: { ...localConfig.pySpark, frecuenciaProcesamiento: e.target.value as any }
                })}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md font-medium text-gray-800 focus:outline-hidden"
              >
                <option value="Diario">Cada 24 horas (Batch nocturno)</option>
                <option value="Semanal">Semanal (Recomendado para PYME)</option>
                <option value="Mensual">Mensual (Bajo costo de cómputo)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Número de Clusters K-Means</label>
              <select
                id="select-spark-k"
                value={localConfig.pySpark.clustersClientes}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  pySpark: { ...localConfig.pySpark, clustersClientes: Number(e.target.value) }
                })}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md font-medium text-gray-800 focus:outline-hidden"
              >
                <option value={2}>2 Clusters (Buen pagador / Moroso)</option>
                <option value={3}>3 Clusters (Premium / Estándar / Crítico)</option>
                <option value={4}>4 Clusters (Corporativo / Taller / Flota / Minorista)</option>
                <option value={5}>5 Clusters (Alta dimensionalidad)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1.5">Tablas de Origen de Datos (PostgreSQL)</label>
              <div className="space-y-1 bg-gray-50 p-2.5 rounded-lg font-mono text-[10px] text-gray-600 border border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>public.erp_cuentas_cobrar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>public.ventas_inventario</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>public.pagos_historicos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Panel de consola / logs del entrenamiento */}
      {(isRetraining || trainingLogs.length > 0) && (
        <div id="logs-console-panel" className="bg-gray-950 p-5 rounded-xl border border-gray-800 font-mono text-xs text-gray-300 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
            <span className="text-gray-400 font-semibold text-[11px] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
              Consola de Compilación y Entrenamiento de Modelos (PySpark/FastAPI)
            </span>
            <span className="text-[10px] text-gray-500">Spark Session ID: spark-aiko-2026</span>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1.5 scrollbar-thin">
            {trainingLogs.map((log, i) => (
              <div key={i} className="animate-fadeIn">{log}</div>
            ))}
            {isRetraining && (
              <div className="text-purple-400 animate-pulse mt-2 font-semibold">🔧 Ejecutando tareas de Machine Learning en segundo plano...</div>
            )}
          </div>
        </div>
      )}

      {/* Mensaje Informativo */}
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 leading-relaxed space-y-1">
          <p className="font-semibold">Explicación para tu Defensa de Tesis:</p>
          <p>
            Al presionar <strong>"Re-entrenar Modelos"</strong>, simulas el proceso completo del backend: PySpark procesa en masa el comportamiento de facturas históricas en PostgreSQL para recalcular los clusters de clientes; Scikit-learn califica los riesgos de impago por factura; y Prophet actualiza las curvas predictivas del Flujo de Caja en base a tus estacionalidades preferidas. En un entorno de producción, este disparador corre mediante un cronjob semanal o vía webhook de FastAPI.
          </p>
        </div>
      </div>

    </div>
  );
}
