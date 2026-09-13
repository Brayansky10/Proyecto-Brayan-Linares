/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CuentaPorCobrar } from '../types';
import { CUENTAS_POR_COBRAR_MOCK, CLIENTES_AIKO } from '../data/mockData';
import { Search, Filter, Plus, DollarSign, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  onAddCuenta: (cuenta: CuentaPorCobrar) => void;
  cuentas: CuentaPorCobrar[];
}

export default function HistoricalRegisters({ cuentas, onAddCuenta }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');
  
  // State para agregar nuevo registro
  const [nuevoCliente, setNuevoCliente] = useState(CLIENTES_AIKO[0]);
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [diasPlazo, setDiasPlazo] = useState('30');
  const [showAddForm, setShowAddForm] = useState(false);

  // Filtrado de registros
  const filteredCuentas = cuentas.filter(c => {
    const matchesSearch = c.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.factura.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFilter === 'Todos' || c.estado === estadoFilter;
    const matchesCategoria = categoriaFilter === 'Todas' || c.categoriaCliente === categoriaFilter;
    return matchesSearch && matchesEstado && matchesCategoria;
  });

  const handleCreateCuenta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMonto || isNaN(Number(nuevoMonto))) return;

    const montoNum = Number(nuevoMonto);
    const emision = new Date().toISOString().split('T')[0];
    
    // Calcular vencimiento
    const vencimientoDate = new Date();
    vencimientoDate.setDate(vencimientoDate.getDate() + Number(diasPlazo));
    const vencimiento = vencimientoDate.toISOString().split('T')[0];

    // Predicción de ML simulada basada en categoría de cliente ficticia
    // Si el cliente tiene un nombre largo, simulamos probabilidad
    const prob = Math.floor(Math.random() * (98 - 40 + 1)) + 40;
    const diasRetraso = prob > 85 ? 0 : prob > 70 ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 25);
    const cat: 'A' | 'B' | 'C' = prob > 90 ? 'A' : prob > 70 ? 'B' : 'C';

    const nueva: CuentaPorCobrar = {
      id: `CC-${111 + cuentas.length}`,
      cliente: nuevoCliente,
      factura: `F-2026-${500 + cuentas.length}`,
      monto: montoNum,
      fechaEmision: emision,
      fechaVencimiento: vencimiento,
      estado: 'Pendiente',
      categoriaCliente: cat,
      probabilidadPago: prob,
      diasRetrasoEstimado: diasRetraso,
      montoRecuperable: Math.round(montoNum * (prob / 100))
    };

    onAddCuenta(nueva);
    setNuevoMonto('');
    setShowAddForm(false);
  };

  return (
    <div id="historical-registers-container" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Registros de Cuentas por Cobrar (Cuentas Corrientes)</h2>
          <p className="text-sm text-gray-500 mt-1">Gestión del flujo tradicional que alimenta a los modelos de Inteligencia Artificial (Prophet/PySpark)</p>
        </div>
        <button
          id="btn-toggle-add-form"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Venta a Crédito</span>
        </button>
      </div>

      {/* Formulario de Nueva Venta a Crédito */}
      {showAddForm && (
        <form id="add-credit-sale-form" onSubmit={handleCreateCuenta} className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm animate-fadeIn space-y-4">
          <h3 className="font-bold text-gray-950 text-sm flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Nuevo Registro de Venta a Crédito (Aiko Repuestos)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Cliente Receptor</label>
              <select
                id="select-new-customer"
                value={nuevoCliente}
                onChange={(e) => setNuevoCliente(e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-emerald-500"
              >
                {CLIENTES_AIKO.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Monto Venta ($ USD)</label>
              <input
                id="input-new-amount"
                type="number"
                placeholder="Ej. 4500"
                value={nuevoMonto}
                onChange={(e) => setNuevoMonto(e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Plazo de Pago (Días)</label>
              <select
                id="select-new-term"
                value={diasPlazo}
                onChange={(e) => setDiasPlazo(e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-emerald-500"
              >
                <option value="15">15 Días (Corto plazo)</option>
                <option value="30">30 Días (Estándar)</option>
                <option value="60">60 Días (Distribuidor)</option>
                <option value="90">90 Días (Flotas Especiales)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                id="btn-submit-sale"
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                Insertar en PostgreSQL
              </button>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            * Nota: Al guardar, la canalización ETL (simulada) procesará la factura mediante el modelo Scikit-learn para estimar automáticamente el Score y Probabilidad de Cobranza.
          </p>
        </form>
      )}

      {/* Controles de búsqueda y filtros */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-records"
            type="text"
            placeholder="Buscar por cliente o factura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 rounded-lg text-xs transition-colors focus:outline-hidden"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px] text-gray-600 font-medium">Estado:</span>
            <select
              id="select-filter-status"
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="bg-transparent text-[11px] font-semibold text-gray-800 focus:outline-hidden cursor-pointer"
            >
              <option value="Todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Vencido">Vencido</option>
              <option value="En Mora">En Mora</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            <span className="text-[11px] text-gray-600 font-medium">Riesgo (Score):</span>
            <select
              id="select-filter-risk"
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="bg-transparent text-[11px] font-semibold text-gray-800 focus:outline-hidden cursor-pointer"
            >
              <option value="Todas">Todas (A, B, C)</option>
              <option value="A">Bajo (Categoría A)</option>
              <option value="B">Medio (Categoría B)</option>
              <option value="C">Alto (Categoría C)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de registros */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 font-semibold">
              <tr>
                <th className="p-4">ID / Factura</th>
                <th className="p-4">Cliente de Repuestos</th>
                <th className="p-4">Fecha Emisión</th>
                <th className="p-4">Vencimiento</th>
                <th className="p-4 text-right">Monto Neto</th>
                <th className="p-4 text-center">Score Riesgo</th>
                <th className="p-4 text-center">Prob. de Pago (ML)</th>
                <th className="p-4 text-center">Desviación (Días)</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {filteredCuentas.length > 0 ? (
                filteredCuentas.map((c) => {
                  const badgeColor = 
                    c.estado === 'Pagado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    c.estado === 'Pendiente' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    c.estado === 'Vencido' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-red-50 text-red-700 border-red-100';

                  const scoreBadge = 
                    c.categoriaCliente === 'A' ? 'bg-emerald-100 text-emerald-800' :
                    c.categoriaCliente === 'B' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800';

                  const probColor = 
                    c.probabilidadPago > 85 ? 'text-emerald-600 font-bold' :
                    c.probabilidadPago > 65 ? 'text-amber-600 font-semibold' :
                    'text-red-500 font-bold';

                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-mono font-medium text-gray-900">
                        <div>{c.id}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{c.factura}</div>
                      </td>
                      <td className="p-4 font-medium text-gray-900">{c.cliente}</td>
                      <td className="p-4 text-gray-500">{c.fechaEmision}</td>
                      <td className="p-4 text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{c.fechaVencimiento}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono font-semibold text-gray-900">
                        ${c.monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${scoreBadge}`}>
                          {c.categoriaCliente}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={probColor}>{c.probabilidadPago}%</span>
                          <span className="text-[9px] text-gray-400">Recuperable: ${c.montoRecuperable}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {c.diasRetrasoEstimado === 0 ? (
                          <span className="text-emerald-600 text-[11px] font-medium">A Tiempo</span>
                        ) : (
                          <span className="text-gray-700 font-medium">+{c.diasRetrasoEstimado}d</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${badgeColor}`}>
                          {c.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle className="w-8 h-8 text-amber-500" />
                      <span>No se encontraron registros que coincidan con los filtros seleccionados.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
