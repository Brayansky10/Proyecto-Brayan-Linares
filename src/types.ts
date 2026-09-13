/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CuentaPorCobrar {
  id: string;
  cliente: string;
  factura: string;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: 'Pendiente' | 'Pagado' | 'Vencido' | 'En Mora';
  categoriaCliente: 'A' | 'B' | 'C'; // Score de riesgo
  probabilidadPago: number; // Predicción de Scikit-Learn (0 - 100%)
  diasRetrasoEstimado: number; // Predicción de días de desviación
  montoRecuperable: number;
}

export interface FlujoCaja {
  id: string;
  fecha: string;
  tipo: 'Ingreso' | 'Egreso';
  categoria: string;
  monto: number;
  origen: 'Real' | 'Predicho';
  descripcion: string;
}

export interface PuntoPrediccion {
  fecha: string;
  real: number | null;
  predicho: number;
  limiteInferior: number;
  limiteSuperior: number;
  volumenVentasCredito: number;
}

export interface ConfigModelos {
  prophet: {
    periodoProyeccion: number; // 15, 30, 60, 90 días
    estacionalidadAnual: boolean;
    estacionalidadSemanal: boolean;
    tipoCrecimiento: 'linear' | 'logistic';
    flexibilidadCambio: number; // changepoint_prior_scale (e.g. 0.05)
  };
  scikitLearn: {
    umbralRiesgoMora: number; // e.g. 75%
    variablesSeleccionadas: string[];
    metodoScoring: 'RandomForest' | 'XGBoost' | 'LogisticRegression';
  };
  pySpark: {
    frecuenciaProcesamiento: 'Diario' | 'Semanal' | 'Mensual';
    clustersClientes: number; // k-means clusters
    fuentesDatos: string[];
  };
}

export interface AlertaFlujo {
  id: string;
  tipo: 'Critica' | 'Advertencia' | 'Informativa';
  titulo: string;
  descripcion: string;
  fecha: string;
  leida: boolean;
}

export interface MensajeChat {
  id: string;
  rol: 'user' | 'assistant';
  contenido: string;
  timestamp: string;
}
