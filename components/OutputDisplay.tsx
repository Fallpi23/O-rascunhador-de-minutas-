
import React, { useState } from 'react';
import type { AnalysisResult, AnalysisType } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { GitCompareArrowsIcon } from './icons/GitCompareArrowsIcon';


interface OutputDisplayProps {
  draft: string;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  isAnalyzing: boolean;
  error: string | null;
  onAnalysisRequest: (type: AnalysisType) => void;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
    <div className="h-4 bg-slate-200 rounded w-full"></div>
    <div className="h-4 bg-slate-200 rounded w-full"></div>
    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
    <div className="h-4 bg-slate-200 rounded w-1/2 mt-6"></div>
    <div className="h-4 bg-slate-200 rounded w-full"></div>
    <div className="h-4 bg-slate-200 rounded w-full"></div>
  </div>
);

const InitialState: React.FC = () => (
  <div className="text-center py-20">
    <SparklesIcon className="mx-auto h-12 w-12 text-slate-400" />
    <h3 className="mt-2 text-lg font-medium text-slate-800">Sua minuta aparecerá aqui</h3>
    <p className="mt-1 text-sm text-slate-500">Preencha os detalhes ao lado para começar.</p>
  </div>
);

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ draft, analysisResult, isLoading, isAnalyzing, error, onAnalysisRequest }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formattedText = (text: string) => {
      return text
        .split('**')
        .map((part, index) => index % 2 !== 0 ? <strong key={index} className="font-bold">{part}</strong> : part)
        .flatMap(part => typeof part === 'string' ? part.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>) : [part]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 min-h-[600px] flex flex-col">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
          <p className="font-semibold">Ocorreu um Erro</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex-grow">
        {isLoading && <LoadingSkeleton />}
        {!isLoading && !draft && <InitialState />}
        {!isLoading && draft && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-800">Minuta Gerada</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
              >
                <CopyIcon className="h-4 w-4" />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <div className="prose prose-slate max-w-none p-4 bg-slate-50 rounded-md border border-slate-200 max-h-[50vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm">{draft}</pre>
            </div>

            <div className="mt-6 border-t pt-6">
                <h4 className="text-md font-semibold text-slate-700 mb-3">Análise com IA</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => onAnalysisRequest('risks')} 
                      disabled={isAnalyzing}
                      className="flex-1 flex items-center justify-center gap-2 text-sm bg-amber-100 text-amber-800 hover:bg-amber-200 font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait">
                        <AlertTriangleIcon className="h-4 w-4" />
                        Analisar Riscos
                    </button>
                    <button 
                      onClick={() => onAnalysisRequest('variations')} 
                      disabled={isAnalyzing}
                      className="flex-1 flex items-center justify-center gap-2 text-sm bg-indigo-100 text-indigo-800 hover:bg-indigo-200 font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait">
                        <GitCompareArrowsIcon className="h-4 w-4" />
                        Sugerir Variações
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>

      {(isAnalyzing || analysisResult) && (
        <div className="mt-6 border-t pt-6">
           <h3 className="text-xl font-semibold text-slate-800 mb-4">{analysisResult?.title || "Analisando..."}</h3>
           <div className="prose prose-slate max-w-none p-4 bg-slate-50 rounded-md border border-slate-200 max-h-[40vh] overflow-y-auto">
             {isAnalyzing && !analysisResult?.content.includes('Analisando...') ? <LoadingSkeleton /> : <pre className="whitespace-pre-wrap font-sans text-sm">{analysisResult?.content}</pre> }
           </div>
        </div>
      )}
    </div>
  );
};
