/**
 * AIModeSelector — Reusable component for choosing AI mode + model.
 *
 * Renders 3 mode buttons (Gemini, Claude CLI, Manual) and a model dropdown
 * when Claude CLI is selected.
 */

'use client';

import { useState, useEffect } from 'react';

export type AIMode = 'gemini' | 'claude-cli' | 'manual';

export interface AIModeConfig {
  mode: AIMode;
  model?: string;
}

interface AIModeSelectorProps {
  value: AIModeConfig;
  onChange: (config: AIModeConfig) => void;
  compact?: boolean;
}

const CLAUDE_MODELS = [
  {
    id: 'claude-haiku-4-5-20251001',
    name: 'Claude Haiku 4.5',
    desc: 'Fastest, lightweight tasks',
  },
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    desc: 'Fast, good quality',
  },
  {
    id: 'claude-opus-4-6',
    name: 'Claude Opus 4.6',
    desc: 'Best quality, slower',
  },
];

export default function AIModeSelector({
  value,
  onChange,
  compact = false,
}: AIModeSelectorProps) {
  const [aiStatus, setAiStatus] = useState<{
    gemini?: { configured?: boolean };
    claudeCli?: { available?: boolean };
  } | null>(null);

  useEffect(() => {
    fetch('/api/ai/status')
      .then((r) => r.json())
      .then((data) => {
        setAiStatus({
          gemini: data.providers?.gemini,
          claudeCli: data.providers?.claudeCli,
        });
      })
      .catch(() => {});
  }, []);

  const geminiAvailable = aiStatus?.gemini?.configured ?? false;
  const claudeCliAvailable = aiStatus?.claudeCli?.available ?? false;

  const modes: {
    id: AIMode;
    name: string;
    icon: string;
    desc: string;
    available: boolean;
    unavailableMsg: string;
  }[] = [
    {
      id: 'gemini',
      name: 'Gemini',
      icon: '\u26A1',
      desc: 'Auto, Free API',
      available: geminiAvailable,
      unavailableMsg: 'Add GEMINI_API_KEY to .env.local',
    },
    {
      id: 'claude-cli',
      name: 'Claude CLI',
      icon: '\uD83E\uDD16',
      desc: 'Auto, Your Subscription',
      available: claudeCliAvailable,
      unavailableMsg: 'Install: npm i -g @anthropic-ai/claude-code',
    },
    {
      id: 'manual',
      name: 'Manual',
      icon: '\u270B',
      desc: 'Copy/Paste to Claude',
      available: true,
      unavailableMsg: '',
    },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Generation Mode
      </label>

      <div className={`grid gap-2 ${compact ? 'grid-cols-3' : 'grid-cols-3'}`}>
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() =>
              onChange({
                mode: mode.id,
                model:
                  mode.id === 'claude-cli'
                    ? value.model || 'claude-sonnet-4-6'
                    : undefined,
              })
            }
            disabled={!mode.available}
            className={`p-3 rounded-lg border text-left transition-colors ${
              value.mode === mode.id
                ? 'border-primary bg-primary/10'
                : mode.available
                  ? 'border-border hover:border-muted-foreground'
                  : 'border-border opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="text-lg">{mode.icon}</div>
            <div className="font-medium text-sm text-foreground">
              {mode.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {mode.available ? mode.desc : mode.unavailableMsg}
            </div>
          </button>
        ))}
      </div>

      {/* Model selector — only for Claude CLI */}
      {value.mode === 'claude-cli' && (
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Claude Model
          </label>
          <select
            value={value.model || 'claude-sonnet-4-6'}
            onChange={(e) => onChange({ ...value, model: e.target.value })}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground"
          >
            {CLAUDE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.desc}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
