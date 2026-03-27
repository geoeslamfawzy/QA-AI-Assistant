/**
 * Builds the chatbot prompt with knowledge base context.
 */

import { retrieveRelevantContext } from './knowledge-retriever';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
}

/**
 * Build the prompt for answering a user question.
 * Includes relevant knowledge base content as context.
 */
export function buildChatbotPrompt(
  question: string,
  conversationHistory: ChatMessage[] = []
): { prompt: string; sources: string[]; hasContext: boolean } {
  const retrieval = retrieveRelevantContext(question, 3);

  const sources = retrieval.relevantDocs.map((d) => d.name);

  let contextSection = '';
  if (retrieval.hasRelevantContent) {
    contextSection = retrieval.relevantDocs
      .map((doc) => `### ${doc.name}\n\n${doc.content}`)
      .join('\n\n---\n\n');
  }

  let historySection = '';
  if (conversationHistory.length > 0) {
    const recent = conversationHistory.slice(-6);
    historySection = `\n## Previous Conversation\n\n${recent
      .map(
        (m) =>
          `**${m.role === 'user' ? 'User' : 'Assistant'}:** ${m.content}`
      )
      .join('\n\n')}\n`;
  }

  const prompt = `You are a knowledgeable product assistant for Yassir Mobility, a ride-hailing platform operating in North & West Africa (Algeria, Tunisia, Morocco, Senegal).

## YOUR ROLE
- You are like a product owner or business analyst who knows the system inside out
- You answer questions ONLY based on the documentation provided below
- You are helping team members understand how the system works
- You are friendly, clear, and specific in your answers

## CRITICAL RULES
1. **ONLY answer from the documentation below.** Do NOT guess, assume, or make up information.
2. If the documentation does NOT contain the answer, say clearly:
   - "This information is not available in the current documentation."
   - OR "The module you're asking about doesn't appear to be documented yet."
   - OR "This business rule isn't covered in the knowledge base. You may want to check with the product team."
3. **Never invent features, rules, or behaviors** that aren't in the docs.
4. When answering, be specific — mention exact field names, button labels, validation rules, and business logic from the docs.
5. If the documentation mentions that a feature was replaced or revamped, clearly state the CURRENT behavior only. Mention the old behavior only if the user specifically asks about it.
6. At the end of your answer, mention which module document(s) you used as source, like: "Source: B2B Portal — Payments"
7. If only partial information is available, answer what you can and clearly state what's missing.
8. Write in simple, clear English. No jargon unless it's used in the docs.
${historySection}
## KNOWLEDGE BASE DOCUMENTATION
${
  retrieval.hasRelevantContent
    ? `The following documentation was found relevant to the user's question:\n\n${contextSection}`
    : `No relevant documentation was found for this question. ${
        retrieval.totalModulesSearched > 0
          ? `(Searched ${retrieval.totalModulesSearched} modules in the knowledge base.)`
          : '(The knowledge base appears to be empty. Run a Jira sync first.)'
      }`
}

## USER'S QUESTION
${question}

Answer the question based ONLY on the documentation above. If the answer isn't in the docs, say so clearly.`;

  return {
    prompt,
    sources,
    hasContext: retrieval.hasRelevantContent,
  };
}
