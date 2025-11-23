
import React from 'react';
import type { DocumentData } from '../types';
import { FileTextIcon } from './icons/FileTextIcon';
import { UsersIcon } from './icons/UsersIcon';
import { CircleDollarSignIcon } from './icons/CircleDollarSignIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface InputFormProps {
  documentData: DocumentData;
  setDocumentData: React.Dispatch<React.SetStateAction<DocumentData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ documentData, setDocumentData, onSubmit, isLoading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDocumentData(prev => ({ ...prev, [name]: value }));
  };
  
  const isFormValid = documentData.party1 && documentData.party2 && documentData.objective;

  const getPartyLabels = () => {
    switch (documentData.type) {
      case 'Contrato':
        return { party1: 'Contratante', party2: 'Contratado(a)' };
      case 'Petição':
        return { party1: 'Autor(a)', party2: 'Réu/Ré' };
      case 'Parecer':
        return { party1: 'Consulente', party2: 'Interessado(a)' };
      default:
        return { party1: 'Parte 1', party2: 'Parte 2' };
    }
  };

  const { party1: party1Label, party2: party2Label } = getPartyLabels();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <h2 className="text-xl font-semibold mb-6 text-slate-800">Detalhes do Documento</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        
        {/* Document Type */}
        <div className="relative">
          <label htmlFor="type" className="block text-sm font-medium text-slate-600 mb-1">Tipo de Documento</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
               <FileTextIcon className="h-5 w-5 text-slate-400" />
            </div>
            <select
              id="type"
              name="type"
              value={documentData.type}
              onChange={handleInputChange}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-2.5 text-slate-700 bg-slate-50"
            >
              <option>Contrato</option>
              <option>Petição</option>
              <option>Parecer</option>
            </select>
          </div>
        </div>

        {/* Parties */}
        <div className="relative">
          <label htmlFor="party1" className="block text-sm font-medium text-slate-600 mb-1">Partes Envolvidas</label>
          <div className="space-y-3">
              <div className="relative">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                   <UsersIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input type="text" name="party1" id="party1" value={documentData.party1} onChange={handleInputChange} placeholder={party1Label} className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-2 text-slate-700 bg-slate-50" />
              </div>
              <div className="relative">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                   <UsersIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input type="text" name="party2" id="party2" value={documentData.party2} onChange={handleInputChange} placeholder={party2Label} className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-2 text-slate-700 bg-slate-50" />
              </div>
          </div>
        </div>

        {/* Value */}
        <div className="relative">
          <label htmlFor="value" className="block text-sm font-medium text-slate-600 mb-1">Valor (Opcional)</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
               <CircleDollarSignIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input type="text" name="value" id="value" value={documentData.value} onChange={handleInputChange} placeholder="Ex: 10.000,00" className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-2 text-slate-700 bg-slate-50" />
          </div>
        </div>

        {/* Objective */}
        <div className="relative">
          <label htmlFor="objective" className="block text-sm font-medium text-slate-600 mb-1">Objeto / Resumo do Caso</label>
          <div className="relative">
             <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3">
               <ClipboardIcon className="h-5 w-5 text-slate-400" />
            </div>
            <textarea
              id="objective"
              name="objective"
              rows={5}
              value={documentData.objective}
              onChange={handleInputChange}
              placeholder="Descreva o propósito do documento, os fatos principais, ou o objetivo do contrato..."
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-2 text-slate-700 bg-slate-50"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full flex justify-center items-center gap-2 rounded-md bg-slate-800 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5" />
              Gerar Minuta
            </>
          )}
        </button>
      </form>
    </div>
  );
};
