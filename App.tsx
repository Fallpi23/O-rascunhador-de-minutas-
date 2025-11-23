
import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { generateDraft, analyzeRisks, suggestVariations } from './services/geminiService';
import type { DocumentData, AnalysisResult, AnalysisType } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';

export default function App(): React.JSX.Element {
  const [documentData, setDocumentData] = useState<DocumentData>({
    type: 'Contrato',
    party1: '',
    party2: '',
    value: '',
    objective: '',
  });

  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDraft = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedDraft('');
    setAnalysisResult(null);

    try {
      const draft = await generateDraft(documentData);
      setGeneratedDraft(draft);
    } catch (e) {
      setError(e instanceof Error ? `Erro ao gerar minuta: ${e.message}` : 'Ocorreu um erro desconhecido.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [documentData]);

  const handleAnalysis = useCallback(async (type: AnalysisType) => {
    if (!generatedDraft) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult({ type, content: 'Analisando...', title: type === 'risks' ? 'Análise de Riscos' : 'Variações de Cláusulas' });

    try {
      let result;
      if (type === 'risks') {
        result = await analyzeRisks(generatedDraft);
      } else {
        result = await suggestVariations(generatedDraft);
      }
      setAnalysisResult({ type, content: result, title: type === 'risks' ? 'Análise de Riscos' : 'Variações de Cláusulas' });
    } catch (e) {
      setError(e instanceof Error ? `Erro ao analisar documento: ${e.message}` : 'Ocorreu um erro desconhecido.');
      console.error(e);
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [generatedDraft]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-800 p-2 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              O Rascunhador de Minutas
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="lg:sticky lg:top-24 self-start">
            <InputForm
              documentData={documentData}
              setDocumentData={setDocumentData}
              onSubmit={handleGenerateDraft}
              isLoading={isLoading}
            />
          </div>
          <div className="mt-8 lg:mt-0">
            <OutputDisplay
              draft={generatedDraft}
              analysisResult={analysisResult}
              isLoading={isLoading}
              isAnalyzing={isAnalyzing}
              error={error}
              onAnalysisRequest={handleAnalysis}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
