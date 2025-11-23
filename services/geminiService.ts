
import { GoogleGenAI } from "@google/genai";
import type { DocumentData } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // Perhaps showing a message to the user in the UI.
  // For this example, we'll throw an error if the key is missing.
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-3-pro-preview";

const getPartyRoles = (docType: string) => {
    switch (docType) {
      case 'Contrato':
        return { party1Role: 'Contratante', party2Role: 'Contratado(a)' };
      case 'Petição':
        return { party1Role: 'Autor(a)', party2Role: 'Réu/Ré' };
      case 'Parecer':
        return { party1Role: 'Consulente', party2Role: 'Interessado(a)' };
      default:
        return { party1Role: 'Parte 1', party2Role: 'Parte 2' };
    }
};

export async function generateDraft(data: DocumentData): Promise<string> {
    const { party1Role, party2Role } = getPartyRoles(data.type);
    
    const prompt = `
      Gere uma minuta de um(a) ${data.type} com as seguintes características:

      - ${party1Role}: ${data.party1}
      - ${party2Role}: ${data.party2}
      ${data.value ? `- Valor da Causa/Contrato: R$ ${data.value}` : ''}
      - Objeto/Resumo do Caso: ${data.objective}

      Estruture o documento de forma clara, com cláusulas/seções bem definidas e numeração apropriada.
      O documento deve ser completo e pronto para uso, incluindo campos para data e assinaturas ao final.
      Não adicione comentários ou notas, apenas o texto do documento legal.
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: "Você é um assistente jurídico especializado em direito brasileiro. Sua tarefa é redigir minutas de documentos legais com base nas informações fornecidas. A linguagem deve ser formal, precisa e em conformidade com a legislação brasileira vigente.",
        }
    });

    if (!response.text) {
        throw new Error("A API não retornou um texto válido.");
    }
    return response.text;
}

export async function analyzeRisks(draft: string): Promise<string> {
    const prompt = `
      Revise a seguinte minuta e aponte, em formato de lista com marcadores, os principais riscos jurídicos, ambiguidades, omissões ou inconsistências com a legislação brasileira. Para cada item, explique o risco de forma concisa e, se possível, sugira uma melhoria.

      Minuta para revisão:
      ---
      ${draft}
      ---
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: "Você é um advogado sênior especialista em análise de risco contratual e processual no contexto do direito brasileiro. Sua análise deve ser crítica, detalhada e focada em proteger os interesses do cliente que estaria utilizando este documento."
        }
    });

    if (!response.text) {
        throw new Error("A API não retornou um texto válido para a análise de riscos.");
    }
    return response.text;
}


export async function suggestVariations(draft: string): Promise<string> {
    const prompt = `
      Analise o seguinte documento e, para as 3 (três) cláusulas mais importantes (como objeto, pagamento, responsabilidades, rescisão), sugira variações com diferentes enfoques. Para cada cláusula, apresente uma versão 'Mais Protetiva para a Parte 1', uma 'Mais Protetiva para a Parte 2' e uma 'Neutra/Equilibrada'. Formate a resposta de forma clara, usando títulos para cada cláusula analisada.

      Documento para análise:
      ---
      ${draft}
      ---
    `;
    
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: "Você é um estrategista jurídico especializado em negociações contratuais e processuais. Sua tarefa é analisar um documento legal e propor variações de cláusulas com diferentes pesos e contrapesos para as partes envolvidas."
        }
    });

    if (!response.text) {
        throw new Error("A API não retornou um texto válido para a sugestão de variações.");
    }
    return response.text;
}
