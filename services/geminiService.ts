
import { GoogleGenAI } from "@google/genai";
import { Tool, User, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateShiftReport = async (
  tools: Tool[],
  users: User[],
  transactions: Transaction[]
) => {
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const completedTransactions = transactions.filter(t => t.status === 'returned');

  const prompt = `
    Analise os seguintes dados de um turno de trabalho em uma oficina/indústria e gere um relatório profissional resumido em Português.
    
    Ferramentas Totais: ${tools.length}
    Transações Pendentes (não devolvidas): ${pendingTransactions.length}
    Transações Concluídas (devolvidas): ${completedTransactions.length}
    
    Detalhes de Pendências:
    ${pendingTransactions.map(t => {
      const tool = tools.find(tool => tool.id === t.toolId);
      const user = users.find(u => u.id === t.userId);
      return `- Ferramenta: ${tool?.name} (${tool?.code}) com Usuário: ${user?.name} (Retirada em: ${new Date(t.checkoutTime).toLocaleString()})`;
    }).join('\n')}

    Por favor, forneça:
    1. Um resumo executivo do estado do inventário ao final do turno.
    2. Recomendações caso existam muitas pendências.
    3. Tom profissional e direto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar relatório com Gemini:", error);
    return "Não foi possível gerar o relatório inteligente no momento. Por favor, verifique os dados manualmente abaixo.";
  }
};
