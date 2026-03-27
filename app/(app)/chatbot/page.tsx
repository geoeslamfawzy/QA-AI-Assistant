'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AIModeSelector, { type AIModeConfig } from '@/components/ai/AIModeSelector';
import ClaudeCliProgress from '@/components/ai/ClaudeCliProgress';
import {
  MessageCircle,
  Send,
  Loader2,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Bot,
  Search,
  DatabaseZap,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

// ════════════════════════════════════════
// TYPES
// ════════════════════════════════════════

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
  isNoAnswer?: boolean;
  originalQuestion?: string;
  jiraSearchDone?: boolean;
  jiraAnswer?: string;
  jiraTicketRefs?: { key: string; title: string; url: string }[];
  kbUpdated?: boolean;
  kbUpdateResult?: { slug: string; file: string; isNewModule: boolean };
  isDigDeeperResult?: boolean;
  helpful?: boolean | null;
}

interface JiraSearchProgress {
  status: string;
  phase: string;
  totalTickets: number;
  fetchedTickets: number;
  currentTicket: string;
  answer: string | null;
  ticketRefs: { key: string; title: string; url: string }[];
  error: string | null;
}

// ════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════

const SUGGESTED_QUESTIONS = [
  'How does the B2B payment system work?',
  'What is the registration flow for a new company?',
  'What user roles exist in the B2B portal?',
  'How does the referral reward system work?',
  'What are the trip statuses in the system?',
  'How does invoice generation work?',
  'What is the difference between prepaid and postpaid?',
  'How does the ride approval process work?',
  'What is a Business Challenge?',
  'How do gift cards work?',
  'How does the login flow work?',
  'How does the driver assignment process work?',
];

const STORAGE_KEY = 'chatbot-history';

let msgCounter = 0;
function nextId() {
  return `msg-${Date.now()}-${++msgCounter}`;
}

// ════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════

function isNoAnswerResponse(text: string): boolean {
  const noAnswerPhrases = [
    'not available in the current documentation',
    'not covered in the knowledge base',
    "doesn't appear to be documented",
    'no relevant documentation was found',
    'not documented yet',
    'check with the product team',
    'no information available',
    'knowledge base appears to be empty',
    'not defined or explained',
    'not available in the knowledge base',
    'cannot confirm',
    'no matching documentation',
  ];
  return noAnswerPhrases.some((phrase) =>
    text.toLowerCase().includes(phrase.toLowerCase())
  );
}

// ════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [aiConfig, setAiConfig] = useState<AIModeConfig>({
    mode: 'claude-cli',
    model: 'claude-sonnet-4-6',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClaudeCliActive, setIsClaudeCliActive] = useState(false);

  // Manual mode state
  const [manualPrompt, setManualPrompt] = useState<string | null>(null);
  const [manualSources, setManualSources] = useState<string[]>([]);
  const [manualResponse, setManualResponse] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Jira search state
  const [isSearchingJira, setIsSearchingJira] = useState(false);
  const [jiraSearchProgress, setJiraSearchProgress] =
    useState<JiraSearchProgress | null>(null);
  const [isUpdatingKB, setIsUpdatingKB] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, isClaudeCliActive, isSearchingJira]);

  // ────────────────────────────────────
  // MESSAGE HELPERS
  // ────────────────────────────────────

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateMessage = useCallback(
    (id: string, updates: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
      );
    },
    []
  );

  // ────────────────────────────────────
  // SEND HANDLER
  // ────────────────────────────────────

  const handleSend = useCallback(async () => {
    const question = input.trim();
    if (!question || isProcessing) return;

    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInput('');
    setManualPrompt(null);

    if (aiConfig.mode === 'manual') {
      setIsProcessing(true);
      try {
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, mode: 'manual', history: messages }),
        });
        const data = await res.json();
        if (data.success) {
          setManualPrompt(data.prompt);
          setManualSources(data.sources || []);
        } else {
          toast.error(data.error || 'Failed to generate prompt');
        }
      } catch {
        toast.error('Failed to generate prompt');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (aiConfig.mode === 'gemini') {
      setIsProcessing(true);
      try {
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, mode: 'gemini', history: messages }),
        });
        const data = await res.json();
        if (data.success && data.response) {
          const noAnswer = isNoAnswerResponse(data.response);
          addMessage({
            id: nextId(),
            role: 'assistant',
            content: data.response,
            sources: data.sources,
            timestamp: new Date().toISOString(),
            isNoAnswer: noAnswer,
            originalQuestion: noAnswer ? question : undefined,
          });
        } else {
          toast.error(data.error || 'Gemini failed');
        }
      } catch {
        toast.error('Failed to get response from Gemini');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (aiConfig.mode === 'claude-cli') {
      setIsProcessing(true);
      setIsClaudeCliActive(true);
      try {
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            mode: 'claude-cli',
            model: aiConfig.model || 'claude-sonnet-4-6',
            history: messages,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          toast.error(data.error || 'Claude CLI failed to start');
          setIsProcessing(false);
          setIsClaudeCliActive(false);
        }
        setManualSources(data.sources || []);
        // Store question for no-answer detection
        sessionStorage.setItem('chatbot-last-question', question);
      } catch {
        toast.error('Failed to start Claude CLI');
        setIsProcessing(false);
        setIsClaudeCliActive(false);
      }
    }
  }, [input, isProcessing, aiConfig, messages, addMessage]);

  const handleClaudeCliComplete = useCallback(
    (output: string) => {
      setIsProcessing(false);
      setIsClaudeCliActive(false);
      const noAnswer = isNoAnswerResponse(output);
      const lastQ = sessionStorage.getItem('chatbot-last-question') || '';
      addMessage({
        id: nextId(),
        role: 'assistant',
        content: output,
        sources: manualSources,
        timestamp: new Date().toISOString(),
        isNoAnswer: noAnswer,
        originalQuestion: noAnswer ? lastQ : undefined,
      });
    },
    [addMessage, manualSources]
  );

  const handleClaudeCliError = useCallback((error: string) => {
    setIsProcessing(false);
    setIsClaudeCliActive(false);
    toast.error(error);
  }, []);

  const handleManualSubmit = useCallback(() => {
    if (!manualResponse.trim()) return;
    const noAnswer = isNoAnswerResponse(manualResponse);
    addMessage({
      id: nextId(),
      role: 'assistant',
      content: manualResponse,
      sources: manualSources,
      timestamp: new Date().toISOString(),
      isNoAnswer: noAnswer,
    });
    setManualResponse('');
    setManualPrompt(null);
    setManualSources([]);
  }, [manualResponse, manualSources, addMessage]);

  // ────────────────────────────────────
  // JIRA SEARCH HANDLER
  // ────────────────────────────────────

  const handleJiraSearch = useCallback(
    async (question: string, msgId: string) => {
      setIsSearchingJira(true);
      updateMessage(msgId, { jiraSearchDone: true });

      try {
        await fetch('/api/chatbot/search-jira', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            mode: aiConfig.mode === 'manual' ? 'claude-cli' : aiConfig.mode,
            model: aiConfig.model,
          }),
        });

        // Poll for progress
        const pollInterval = setInterval(async () => {
          try {
            const res = await fetch('/api/chatbot/search-jira');
            const progress: JiraSearchProgress = await res.json();
            setJiraSearchProgress(progress);

            if (
              progress.status === 'completed' ||
              progress.status === 'failed'
            ) {
              clearInterval(pollInterval);
              setIsSearchingJira(false);

              if (progress.answer) {
                updateMessage(msgId, {
                  jiraAnswer: progress.answer,
                  jiraTicketRefs: progress.ticketRefs,
                });
              }
              if (progress.error) {
                toast.error(progress.error);
              }
            }
          } catch {
            // ignore poll errors
          }
        }, 2000);
      } catch {
        setIsSearchingJira(false);
        toast.error('Failed to start Jira search');
      }
    },
    [aiConfig, updateMessage]
  );

  // ────────────────────────────────────
  // KB UPDATE HANDLER
  // ────────────────────────────────────

  const handleUpdateKB = useCallback(
    async (msg: ChatMessage) => {
      setIsUpdatingKB(true);
      try {
        const res = await fetch('/api/chatbot/update-kb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: msg.originalQuestion || msg.content,
            answer: msg.jiraAnswer,
            ticketRefs: msg.jiraTicketRefs,
            moduleName: 'auto-detect',
            mode: aiConfig.mode === 'manual' ? 'claude-cli' : aiConfig.mode,
            model: aiConfig.model,
          }),
        });
        const result = await res.json();
        if (result.success) {
          updateMessage(msg.id, {
            kbUpdated: true,
            kbUpdateResult: result,
          });
          toast.success(`Knowledge base updated: ${result.file}`);
        } else {
          toast.error(result.error || 'Failed to update KB');
        }
      } catch {
        toast.error('Failed to update knowledge base');
      }
      setIsUpdatingKB(false);
    },
    [updateMessage, aiConfig]
  );

  // ────────────────────────────────────
  // OTHER HANDLERS
  // ────────────────────────────────────

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setManualPrompt(null);
    setManualResponse('');
    setIsSearchingJira(false);
    setJiraSearchProgress(null);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Chat cleared');
  }, []);

  const handleSuggestedQuestion = useCallback((q: string) => {
    setInput(q);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleCopyPrompt = useCallback(async () => {
    if (!manualPrompt) return;
    await navigator.clipboard.writeText(manualPrompt);
    setCopiedPrompt(true);
    toast.success('Prompt copied');
    setTimeout(() => setCopiedPrompt(false), 2000);
  }, [manualPrompt]);

  // ────────────────────────────────────
  // HELPER: Find user question for an assistant message
  // ────────────────────────────────────

  const getLastUserQuestion = useCallback(
    (assistantMsg: ChatMessage): string => {
      const msgIndex = messages.findIndex((m) => m.id === assistantMsg.id);
      if (msgIndex > 0) {
        for (let i = msgIndex - 1; i >= 0; i--) {
          if (messages[i].role === 'user') return messages[i].content;
        }
      }
      return '';
    },
    [messages]
  );

  // ────────────────────────────────────
  // RENDER
  // ────────────────────────────────────

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-purple-500" />
            Knowledge Base Assistant
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask questions about the system. Falls back to Jira search if not in KB.
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearChat}>
            <Trash2 className="mr-2 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* AI Mode Selector */}
      <Card className="shrink-0 mb-4">
        <CardContent className="pt-4 pb-4">
          <AIModeSelector value={aiConfig} onChange={setAiConfig} compact />
        </CardContent>
      </Card>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-t-lg border border-border border-b-0 bg-background p-4 space-y-4">
        {/* Empty state */}
        {messages.length === 0 && !isProcessing && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 mb-4">
              <Bot className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Ask me anything about the system
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              I answer from the knowledge base first. If I can&apos;t find the answer, I&apos;ll
              offer to search Jira tickets directly.
            </p>
            <div className="flex flex-wrap gap-2 max-w-lg justify-center">
              {SUGGESTED_QUESTIONS.slice(0, 8).map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id}>
          {msg.role === 'user' ? (
            <div className="flex gap-3 justify-end">
              <div className="max-w-[75%] bg-purple-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-lg">
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-xs text-white font-bold shrink-0">
                EF
              </div>
            </div>
          ) : (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs text-white font-bold shrink-0">
                AI
              </div>
              <div className="max-w-[80%] space-y-0">
                {/* Main answer bubble */}
                <div className="bg-secondary border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
                  <div className="text-sm leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-lg font-bold text-purple-300 mt-4 mb-2 border-b border-border pb-1">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-bold text-purple-300 mt-3 mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-semibold text-purple-200 mt-3 mb-1">{children}</h3>,
                        p: ({ children }) => <p className="text-foreground mb-2 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="text-purple-300 font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="text-muted-foreground italic">{children}</em>,
                        ul: ({ children }) => <ul className="list-none space-y-1 my-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 text-foreground">{children}</ol>,
                        li: ({ children }) => (
                          <li className="text-foreground flex items-start gap-2">
                            <span className="text-purple-400 mt-1 shrink-0">&bull;</span>
                            <span>{children}</span>
                          </li>
                        ),
                        code: ({ children, className }) => {
                          const isInline = !className;
                          return isInline
                            ? <code className="bg-muted text-purple-300 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                            : <code className="block bg-background text-foreground p-3 rounded-lg text-xs font-mono my-2 overflow-x-auto">{children}</code>;
                        },
                        pre: ({ children }) => <pre className="bg-background rounded-lg my-2 overflow-x-auto">{children}</pre>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-purple-500 pl-3 my-2 text-muted-foreground italic">{children}</blockquote>
                        ),
                        hr: () => <hr className="border-border my-3" />,
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">{children}</a>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-2">
                            <table className="w-full text-sm border-collapse">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
                        th: ({ children }) => <th className="border border-border px-3 py-1.5 text-left text-purple-300 font-medium text-xs">{children}</th>,
                        td: ({ children }) => <td className="border border-border px-3 py-1.5 text-foreground text-xs">{children}</td>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* No-answer warning */}
                  {msg.isNoAnswer && (
                    <div className="mt-2 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Limited or no information found in the knowledge base.
                    </div>
                  )}

                  {/* Source modules */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-border/50 flex flex-wrap gap-1.5">
                      {msg.sources.map((source) => (
                        <span
                          key={source}
                          className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20"
                        >
                          &#x1F4C4; {source}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action buttons — mutually exclusive:
                    isNoAnswer → "Search Jira" card
                    !isNoAnswer → "Dig deeper" inline + thumbs */}

                {/* Option A: No answer → prominent "Search Jira?" card */}
                {msg.isNoAnswer && !msg.jiraSearchDone && !isSearchingJira && (
                  <div className="mt-3 p-3 bg-secondary/80 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2">
                      Would you like me to search Jira tickets for this information?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleJiraSearch(
                            msg.originalQuestion || getLastUserQuestion(msg),
                            msg.id
                          )
                        }
                        disabled={isSearchingJira}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Search className="h-3.5 w-3.5" />
                        Yes, search Jira
                      </button>
                      <button
                        onClick={() =>
                          updateMessage(msg.id, { jiraSearchDone: true })
                        }
                        className="px-3 py-1.5 bg-secondary hover:bg-muted text-muted-foreground text-sm rounded-lg border border-border transition-colors"
                      >
                        No thanks
                      </button>
                    </div>
                  </div>
                )}

                {/* Option B: Answer found → small "Dig deeper" + thumbs inline */}
                {!msg.isNoAnswer && !msg.isDigDeeperResult && !msg.jiraSearchDone && !isSearchingJira && (
                  <div className="mt-2 flex gap-2 items-center">
                    <button
                      onClick={() =>
                        handleJiraSearch(
                          msg.originalQuestion || getLastUserQuestion(msg),
                          msg.id
                        )
                      }
                      disabled={isSearchingJira}
                      className="px-3 py-1 text-xs bg-secondary hover:bg-muted text-muted-foreground rounded-lg border border-border flex items-center gap-1 transition-colors"
                    >
                      <Search className="h-3 w-3" />
                      Dig deeper in Jira
                    </button>
                    <button
                      onClick={() =>
                        updateMessage(msg.id, {
                          helpful: msg.helpful === true ? null : true,
                        })
                      }
                      className={`px-2 py-1 text-xs rounded-lg border transition-colors ${
                        msg.helpful === true
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      &#x1F44D;
                    </button>
                    <button
                      onClick={() =>
                        updateMessage(msg.id, {
                          helpful: msg.helpful === false ? null : false,
                        })
                      }
                      className={`px-2 py-1 text-xs rounded-lg border transition-colors ${
                        msg.helpful === false
                          ? 'bg-red-500/20 border-red-500 text-red-400'
                          : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      &#x1F44E;
                    </button>
                  </div>
                )}

                {/* Jira search progress (shown inline for the message being searched) */}
                {msg.jiraSearchDone &&
                  !msg.jiraAnswer &&
                  isSearchingJira &&
                  jiraSearchProgress && (
                    <div className="mt-2 p-3 bg-secondary rounded-lg border border-border space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full" />
                        <span className="text-sm text-purple-400">
                          {jiraSearchProgress.phase}
                        </span>
                      </div>
                      {jiraSearchProgress.totalTickets > 0 && (
                        <>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                              style={{
                                width: `${(jiraSearchProgress.fetchedTickets / jiraSearchProgress.totalTickets) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {jiraSearchProgress.currentTicket && (
                              <span>&#x1F4CB; {jiraSearchProgress.currentTicket} &bull; </span>
                            )}
                            {jiraSearchProgress.fetchedTickets}/
                            {jiraSearchProgress.totalTickets} tickets
                          </div>
                        </>
                      )}
                    </div>
                  )}

                {/* Jira answer */}
                {msg.jiraAnswer && (
                  <div className="mt-2 space-y-2">
                    <div className="p-3 bg-secondary rounded-lg border border-purple-500/30">
                      <div className="text-xs text-purple-400 mb-2 flex items-center gap-1">
                        <Search className="h-3 w-3" />
                        Found in Jira:
                      </div>
                      <div className="text-sm leading-relaxed">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="text-foreground mb-2 leading-relaxed">{children}</p>,
                            strong: ({ children }) => <strong className="text-purple-300 font-semibold">{children}</strong>,
                            ul: ({ children }) => <ul className="list-none space-y-1 my-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 text-foreground">{children}</ol>,
                            li: ({ children }) => (
                              <li className="text-foreground flex items-start gap-2">
                                <span className="text-purple-400 mt-1 shrink-0">&bull;</span>
                                <span>{children}</span>
                              </li>
                            ),
                            code: ({ children }) => <code className="bg-muted text-purple-300 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                            h3: ({ children }) => <h3 className="text-sm font-semibold text-purple-200 mt-3 mb-1">{children}</h3>,
                          }}
                        >
                          {msg.jiraAnswer}
                        </ReactMarkdown>
                      </div>

                      {/* Ticket references */}
                      {msg.jiraTicketRefs && msg.jiraTicketRefs.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/50 flex flex-wrap gap-1">
                          {msg.jiraTicketRefs.map((ref) => (
                            <a
                              key={ref.key}
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20 hover:bg-purple-500/20 flex items-center gap-1 transition-colors"
                            >
                              &#x1F3AB; {ref.key}
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Update KB option */}
                    {!msg.kbUpdated && (
                      <div className="p-3 bg-secondary/80 rounded-lg border border-border">
                        <p className="text-sm text-muted-foreground mb-2">
                          Update the knowledge base with this information?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateKB(msg)}
                            disabled={isUpdatingKB}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                          >
                            <DatabaseZap className="h-3.5 w-3.5" />
                            {isUpdatingKB
                              ? 'Updating...'
                              : 'Yes, update knowledge base'}
                          </button>
                          <button
                            onClick={() =>
                              updateMessage(msg.id, { kbUpdated: true })
                            }
                            className="px-3 py-1.5 bg-secondary hover:bg-muted text-muted-foreground text-sm rounded-lg border border-border transition-colors"
                          >
                            No, skip
                          </button>
                        </div>
                      </div>
                    )}

                    {/* KB updated confirmation */}
                    {msg.kbUpdated && msg.kbUpdateResult && (
                      <div className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Knowledge base updated: {msg.kbUpdateResult.file}
                      </div>
                    )}

                    {/* KB update skipped */}
                    {msg.kbUpdated && !msg.kbUpdateResult && (
                      <div className="text-xs text-muted-foreground px-3 py-1">
                        KB update skipped.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        ))}

        {/* Processing indicator */}
        {isProcessing && !isClaudeCliActive && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs text-white font-bold shrink-0">
              AI
            </div>
            <div className="bg-secondary border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}

        {/* Claude CLI progress */}
        {isClaudeCliActive && (
          <div className="ml-11">
            <ClaudeCliProgress
              isActive={isClaudeCliActive}
              onComplete={handleClaudeCliComplete}
              onError={handleClaudeCliError}
            />
          </div>
        )}

        {/* Manual mode: prompt + paste */}
        {manualPrompt && aiConfig.mode === 'manual' && (
          <div className="ml-11 bg-secondary border border-border rounded-2xl rounded-bl-md p-4 space-y-3">
            <details>
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Generated Prompt (click to view, then copy to Claude)
              </summary>
              <pre className="mt-2 text-xs text-muted-foreground max-h-48 overflow-y-auto whitespace-pre-wrap bg-background p-3 rounded-lg">
                {manualPrompt}
              </pre>
            </details>
            <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
              {copiedPrompt ? (
                <>
                  <Check className="mr-2 h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-3 w-3" />
                  Copy Prompt
                </>
              )}
            </Button>
            <textarea
              placeholder="Paste Claude's response here..."
              value={manualResponse}
              onChange={(e) => setManualResponse(e.target.value)}
              className="w-full h-32 bg-background border border-border rounded-lg p-3 text-sm text-foreground resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            />
            <Button
              onClick={handleManualSubmit}
              disabled={!manualResponse.trim()}
              size="sm"
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              Use Response
            </Button>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input — ALWAYS visible at bottom */}
      <div className="shrink-0 rounded-b-lg border border-border border-t-0 bg-secondary p-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the system..."
            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            disabled={isProcessing || isSearchingJira}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing || isSearchingJira}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            {isProcessing ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
