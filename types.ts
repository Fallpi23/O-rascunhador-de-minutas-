
export type DocumentType = 'Contrato' | 'Petição' | 'Parecer';

export interface DocumentData {
  type: DocumentType;
  party1: string;
  party2: string;
  value: string;
  objective: string;
}

export type AnalysisType = 'risks' | 'variations';

export interface AnalysisResult {
  type: AnalysisType;
  title: string;
  content: string;
}
