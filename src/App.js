import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [latexCode, setLatexCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pdfId, setPdfId] = useState(null);
  const [error, setError] = useState(null);

  // URL del backend (actualizar con la URL de tu Replit)
  const API_URL = "https://back2-0-jwos.onrender.com";

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const convertToLatex = async () => {
    if (!inputText.trim()) {
      setError('Por favor, ingresa algún texto para convertir');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/conversion/text-to-latex`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputText,
          mathMode: false 
        }),
      });

      if (!response.ok) {
        throw new Error('Error al convertir el texto');
      }

      const data = await response.json();
      setLatexCode(data.latex);
    } catch (err) {
      setError('Error al comunicarse con el servidor: ' + err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!latexCode) {
      setError('Primero debes convertir el texto a LaTeX');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/generar-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: latexCode }),
      });

      if (!response.ok) {
        throw new Error('Error al generar el PDF');
      }

      const data = await response.json();
      setPdfId(data.id);
    } catch (err) {
      setError('Error al generar el PDF: ' + err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!pdfId) return;
    window.open(`${API_URL}/descargar/${pdfId}`, '_blank');
  };

  return (
    <div className="container">
      <h1 className="app-title">Conversor de Texto a LaTeX</h1>
      
      <div className="converter-section">
        <h2>Texto de entrada</h2>
        <textarea 
          className="input-textarea"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Pega aquí tu texto para convertir a LaTeX..."
          rows={10}
        />
        <button 
          className="action-button convert-button"
          onClick={convertToLatex}
          disabled={isLoading}
        >
          {isLoading ? 'Convirtiendo...' : 'Convertir a LaTeX'}
        </button>
      </div>

      {latexCode && (
        <div className="result-section">
          <h2>Código LaTeX generado</h2>
          <div className="latex-code-container">
            <pre className="latex-code">{latexCode}</pre>
          </div>
          <div className="action-buttons">
            <button 
              className="action-button generate-button"
              onClick={generatePDF}
              disabled={isLoading}
            >
              {isLoading ? 'Generando...' : 'Generar PDF'}
            </button>
            
            {pdfId && (
              <button 
                className="action-button download-button"
                onClick={downloadPDF}
              >
                Descargar PDF
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

export default App; 