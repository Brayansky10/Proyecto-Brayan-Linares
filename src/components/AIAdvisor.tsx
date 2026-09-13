/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { MensajeChat, CuentaPorCobrar } from '../types';
import { Send, Bot, User, BrainCircuit, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';

interface Props {
  cuentas: CuentaPorCobrar[];
}

export default function AIAdvisor({ cuentas }: Props) {
  const [messages, setMessages] = useState<MensajeChat[]>([
    {
      id: 'msg-01',
      rol: 'assistant',
      contenido: '¡Hola! Soy tu **Asesor de Tesis de Inteligencia de Negocios e IA**. He analizado los datos actuales de **Aiko Repuestos**, incluyendo el DSO proyectado, el comportamiento de las cuentas por cobrar, y las proyecciones a 15/30/60/90 días de Prophet.\n\n¿En qué aspecto de tu tesis te gustaría profundizar hoy? Puedo ayudarte a:\n\n1. **Analizar la salud del Flujo de Caja** proyectado y proponer estrategias financieras.\n2. **Explicar la arquitectura de datos** (FastAPI, PySpark, Scikit-learn, PostgreSQL) para tu redacción de tesis.\n3. **Justificar la viabilidad económica** del proyecto basándome en los KPIs simulados.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg: MensajeChat = {
      id: `msg-${Date.now()}`,
      rol: 'user',
      contenido: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: textToSend,
          cuentas: cuentas.map(c => ({
            cliente: c.cliente,
            monto: c.monto,
            estado: c.estado,
            probabilidadPago: c.probabilidadPago,
            categoriaCliente: c.categoriaCliente
          }))
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo conectar con el servidor de la tesis para obtener análisis.');
      }

      const data = await response.json();
      
      const assistantMsg: MensajeChat = {
        id: `msg-${Date.now() + 1}`,
        rol: 'assistant',
        contenido: data.analysis || 'No logré computar un informe financiero en este momento. Intenta de nuevo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error inesperado al conectar con Gemini.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggest = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div id="ai-advisor-container" className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      
      {/* Columna Izquierda: Información Académica de Tesis */}
      <div className="space-y-4 lg:col-span-1">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-xl shadow-xs border border-indigo-800 space-y-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm">Copiloto Académico</h3>
          </div>
          <p className="text-[11px] text-indigo-200 leading-relaxed">
            Este consultor está impulsado por <strong>Gemini 3.5 Flash</strong> a través de FastAPI. Está configurado con el rol de un Director de Tesis y Consultor Financiero experto.
          </p>
          <div className="border-t border-indigo-800/80 pt-3 space-y-2 text-[10px] text-indigo-300">
            <div className="font-semibold text-white uppercase tracking-wider">Métricas de Contexto Sincronizadas:</div>
            <div>• Clientes de Repuestos: {cuentas.length}</div>
            <div>• Facturas Activas: {cuentas.filter(c => c.estado !== 'Pagado').length}</div>
            <div>• Cartera en Riesgo: ${cuentas.filter(c => c.estado === 'En Mora' || c.estado === 'Vencido').reduce((acc, c) => acc + c.monto, 0).toLocaleString()} USD</div>
          </div>
        </div>

        {/* Sugerencias Rápidas */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs space-y-3">
          <span className="text-[10px] text-gray-400 font-bold uppercase block flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Consultas de Tesis Frecuentes
          </span>
          <div className="space-y-2">
            {[
              '¿Cómo vincula este sistema predictivo la rotación de repuestos con la liquidez?',
              '¿Qué ventaja metodológica tiene usar Prophet frente a redes LSTM en mi tesis?',
              'Ayúdame a redactar el capítulo de recomendaciones prácticas para Aiko Repuestos.'
            ].map((p, idx) => (
              <button
                id={`btn-suggest-prompt-${idx}`}
                key={idx}
                onClick={() => handleSuggest(p)}
                disabled={isLoading}
                className="w-full text-left text-xs p-2.5 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-900 rounded-lg transition-colors border border-gray-150 text-gray-600 block leading-normal cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Columna Derecha: Chat de IA */}
      <div className="lg:col-span-3 bg-white border border-gray-150 rounded-xl shadow-2xs flex flex-col h-[520px] overflow-hidden">
        {/* Cabecera Chat */}
        <div className="bg-gray-50 border-b border-gray-150 px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <div>
              <span className="font-bold text-gray-900 text-sm block">Asesor Financiero e IA de Tesis</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Sincronizado con base de datos en tiempo real
              </span>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
          {messages.map((m) => {
            const isAI = m.rol === 'assistant';
            return (
              <div 
                key={m.id} 
                className={`flex gap-3 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-3xs ${
                  isAI ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-white'
                }`}>
                  {isAI ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                {/* Burbuja de texto */}
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  isAI 
                    ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-3xs' 
                    : 'bg-indigo-600 text-white rounded-tr-none'
                }`}>
                  {/* Formateo simple de markdown: negritas y listas */}
                  <div className="whitespace-pre-line space-y-1">
                    {m.contenido.split('\n').map((line, i) => {
                      // Negritas simples (**texto**)
                      let formattedLine = line;
                      const boldRegex = /\*\*(.*?)\*\*/g;
                      let match;
                      const parts = [];
                      let lastIndex = 0;
                      
                      while ((match = boldRegex.exec(line)) !== null) {
                        parts.push(formattedLine.substring(lastIndex, match.index));
                        parts.push(<strong key={match.index} className={isAI ? 'text-gray-950 font-bold' : 'text-white font-bold'}>{match[1]}</strong>);
                        lastIndex = boldRegex.lastIndex;
                      }
                      parts.push(formattedLine.substring(lastIndex));

                      const displayContent = parts.length > 0 ? parts : line;

                      if (line.startsWith('* ') || line.startsWith('- ')) {
                        return (
                          <div key={i} className="pl-4 relative flex items-start gap-1">
                            <span className="absolute left-1 top-2 w-1 h-1 rounded-full bg-indigo-400"></span>
                            <span>{line.substring(2)}</span>
                          </div>
                        );
                      }
                      return <p key={i}>{displayContent}</p>;
                    })}
                  </div>
                  <span className={`text-[9px] block text-right mt-1.5 ${isAI ? 'text-gray-400' : 'text-indigo-200'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-3xs text-xs text-gray-500 animate-pulse">
                Procesando datos en FastAPI y generando análisis de IA...
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form 
          id="ai-chat-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputText);
          }} 
          className="p-3 border-t border-gray-150 bg-gray-50 flex gap-2"
        >
          <input
            id="input-chat-query"
            type="text"
            placeholder="Haz una pregunta sobre tu tesis, finanzas o algoritmos..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500 disabled:opacity-60"
          />
          <button
            id="btn-send-chat"
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Consultar</span>
          </button>
        </form>
      </div>

    </div>
  );
}
