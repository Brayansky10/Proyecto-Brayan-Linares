/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CuentaPorCobrar, ConfigModelos } from './types';
import { CUENTAS_POR_COBRAR_MOCK, CONFIG_DEFECTO_MOCK } from './data/mockData';
import DashboardLayouts from './components/DashboardLayouts';
import ModelConfiguration from './components/ModelConfiguration';
import HistoricalRegisters from './components/HistoricalRegisters';
import TechnicalReport from './components/TechnicalReport';
import AIAdvisor from './components/AIAdvisor';
import { 
  TrendingUp, Sliders, Database, FileText, Bot, ShieldCheck, 
  Car, GraduationCap, RefreshCw
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'config' | 'registers' | 'report' | 'advisor'>('dashboard');
  const [cuentas, setCuentas] = useState<CuentaPorCobrar[]>(CUENTAS_POR_COBRAR_MOCK);
  const [config, setConfig] = useState<ConfigModelos>(CONFIG_DEFECTO_MOCK);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleAddCuenta = (nueva: CuentaPorCobrar) => {
    setCuentas(prev => [nueva, ...prev]);
  };

  const handleSyncERP = () => {
    setIsSyncing(true);
    setSyncStatus("Sincronizando...");
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus("¡Sincronizado!");
      setTimeout(() => setSyncStatus(null), 3000);
    }, 1200);
  };

  return (
    <div className="flex h-screen w-screen bg-[#f8fafc] text-[#1e293b] font-sans overflow-hidden">
      
      {/* SECCIÓN 1: Left Sidebar (Professional Polish Style) */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col shrink-0 border-r border-slate-800">
        
        {/* Branding & Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold shadow-xs">
              <Car className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight leading-tight uppercase text-white">Aiko Repuestos</h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Predictive Cash Flow</p>
            </div>
          </div>
        </div>

        {/* Tesis Context Banner en Sidebar */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80">
          <div className="flex gap-2 items-start">
            <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[10px] text-slate-300 leading-normal">
              <span className="font-bold text-white block text-[10px]">PROYECTO DE TESIS</span>
              Mantenimiento predictivo de flujo de caja para ventas a crédito.
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Links divided into Operativo and Inteligencia */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          
          {/* Categoría: Operativo */}
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Operativo</div>
            <div className="space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard Predictivo', icon: TrendingUp },
                { id: 'registers', label: 'Cuentas por Cobrar', icon: Database },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    id={`nav-tab-sidebar-${tab.id}`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-xs font-bold' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categoría: Inteligencia */}
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Inteligencia</div>
            <div className="space-y-1">
              {[
                { id: 'config', label: 'Configuración ML Prophet', icon: Sliders },
                { id: 'advisor', label: 'Asesor IA (Tesis)', icon: Bot },
                { id: 'report', label: 'Informe Técnico', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    id={`nav-tab-sidebar-${tab.id}`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-xs font-bold' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400 border border-slate-700">
              UI
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Consultor UI/UX</div>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Tesis BI & ML</p>
            </div>
          </div>
        </div>

      </aside>

      {/* SECCIÓN 2: Right Main Panel */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Right Header Panel */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-3xs">
          
          {/* Tesis Topic Info */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">Caso de Estudio:</span>
            <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-md border border-slate-200/60 shadow-3xs">
              Aiko Repuestos S.A.
            </span>
          </div>

          {/* Model Status & Sincronizar Button */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Estado del Modelo IA</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                Entrenado (Precisión 94.2%)
              </span>
            </div>

            <button 
              id="sync-erp-header-btn"
              onClick={handleSyncERP}
              disabled={isSyncing}
              className={`bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-3xs flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] ${
                isSyncing ? 'opacity-80' : ''
              }`}
            >
              {isSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : null}
              <span>{syncStatus || "Sincronizar ERP"}</span>
            </button>
          </div>

        </header>

        {/* Content Area with background and custom styling */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-8 animate-fadeIn">
          
          {/* Main Context Card */}
          <div className="mb-6 bg-gradient-to-r from-slate-900 to-[#1e293b] text-white p-6 rounded-xl shadow-xs border border-slate-800 relative overflow-hidden">
            <div className="relative z-10 space-y-2 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Mantenimiento Inteligente de Flujo
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {activeTab === 'dashboard' && "Visualizador de Flujo de Caja y Proyecciones Predictivas"}
                {activeTab === 'registers' && "Bandeja Operativa de Cuentas por Cobrar (AR)"}
                {activeTab === 'config' && "Configuración de Modelos Predictivos y Simulación What-If"}
                {activeTab === 'advisor' && "Asistente Académico de Tesis de Grado e IA"}
                {activeTab === 'report' && "Informe Técnico y de Validación de Algoritmos ML"}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {activeTab === 'dashboard' && "Evalúa la interacción entre los datos históricos de cuentas corrientes de Aiko y las predicciones calculadas por Prophet. Explora las distintas visualizaciones del demostrador académico."}
                {activeTab === 'registers' && "Administra la cartera de crédito en tiempo real. Agrega facturas, evalúa riesgos predictivos y simula el impacto financiero antes de la persistencia de datos."}
                {activeTab === 'config' && "Establece los hiperparámetros de Prophet y los modelos de regresión de PySpark para calibrar los intervalos de confianza del CashFlow."}
                {activeTab === 'advisor' && "Consulta de forma interactiva la justificación financiera, metodología o códigos de implementación (FastAPI/PySpark/Scikit-Learn/Prophet) de la tesis."}
                {activeTab === 'report' && "Análisis pormenorizado del rendimiento predictivo (MAE, MAPE), la arquitectura del pipeline de datos distribuido y las conclusiones del proyecto."}
              </p>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-blue-500/10 via-transparent to-transparent pointer-events-none hidden md:block"></div>
          </div>

          {/* Conditional Component Render */}
          <div className="space-y-6">
            {activeTab === 'dashboard' && (
              <div id="view-dashboard" className="animate-fadeIn">
                <DashboardLayouts cuentas={cuentas} config={config} />
              </div>
            )}

            {activeTab === 'config' && (
              <div id="view-config" className="animate-fadeIn">
                <ModelConfiguration config={config} onUpdateConfig={setConfig} />
              </div>
            )}

            {activeTab === 'registers' && (
              <div id="view-registers" className="animate-fadeIn">
                <HistoricalRegisters cuentas={cuentas} onAddCuenta={handleAddCuenta} />
              </div>
            )}

            {activeTab === 'report' && (
              <div id="view-report" className="animate-fadeIn">
                <TechnicalReport />
              </div>
            )}

            {activeTab === 'advisor' && (
              <div id="view-advisor" className="animate-fadeIn">
                <AIAdvisor cuentas={cuentas} />
              </div>
            )}
          </div>

        </div>

        {/* Compact polished footer */}
        <footer className="bg-white border-t border-slate-200 py-3 px-8 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
          <div>
            © 2026 Aiko Repuestos S.A. • Demostrador de Tesis de Ingeniería de Sistemas.
          </div>
          <div className="flex items-center gap-3">
            <span>FastAPI v0.110.0</span>
            <span>•</span>
            <span>Prophet v1.1.5</span>
            <span>•</span>
            <span>PySpark v3.5.0</span>
            <span>•</span>
            <span>React + Tailwind CSS</span>
          </div>
        </footer>

      </main>

    </div>
  );
}

