import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API Routes
app.post('/api/gemini/advisor', async (req, res) => {
  try {
    const { prompt, cuentas } = req.body;

    if (!ai) {
      // Fallback response if API Key is not configured
      return res.json({
        analysis: `⚠️ **[Modo de Demostración Local - Sin API Key de Gemini]**
        
        Para habilitar los análisis dinámicos de Inteligencia Artificial de tu tesis en tiempo real, ingresa tu clave API en la pestaña **Settings > Secrets** de AI Studio.
        
        **Respuesta simulada para tu tesis basada en la pregunta: "${prompt}":**
        Este sistema integrado para **Aiko Repuestos** resuelve el problema crítico de la liquidez mediante un pipeline estructurado. 
        1. **Mapeo con PySpark**: Clasifica los talleres por comportamiento, reduciendo el riesgo moral.
        2. **Proyección de Prophet**: Al modelar a 15, 30, 60 y 90 días, Aiko puede coordinar las importaciones de repuestos (que exigen pago adelantado) con los plazos de crédito otorgados.
        3. **Mitigación del DSO**: Al vigilar los días promedio de cobro, el gerente puede ajustar las alarmas tempranas antes de que ocurra una ruptura de flujo de caja.`
      });
    }

    // Contexto de los datos actuales de la pyme para enriquecer el prompt
    const contextoCuentas = JSON.stringify(cuentas || []);

    const systemInstruction = `Actúas como un Director de Tesis Académico y Consultor de Finanzas y UX/UI experto. 
    Estás guiando al usuario en su defensa y redacción de tesis de grado titulada: "Sistema Integrado de Predicción y Mantenimiento Inteligente del Flujo de Caja para Ventas a Crédito" para la empresa "Aiko Repuestos" (autopartes).
    
    El sistema cuenta con un backend (FastAPI, PostgreSQL, PySpark, Scikit-Learn y Prophet) y un frontend interactivo en Dash/Plotly.
    Contexto actual de las facturas ingresadas en PostgreSQL: ${contextoCuentas}.
    
    Tus respuestas deben:
    1. Ser académicamente rigurosas, usando términos como DSO (Days Sales Outstanding), Prophet seasonality, clustering K-Means, MAE, etc.
    2. Mantenerse enfocadas en resolver problemas de liquidez y vincular la rotación de inventarios con el crédito de Aiko Repuestos.
    3. Ser motivadoras, amigables, estructuradas con formato markdown limpio (negritas, listas), redactadas exclusivamente en Español y sin hacer referencias técnicas a archivos de código internos.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Error interno al procesar el asesoramiento con la IA.' });
  }
});

// Setup Vite Dev Server / Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
