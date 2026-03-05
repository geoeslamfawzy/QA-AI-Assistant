// AI Module - Main exports

export {
  createMessage,
  createStreamingMessage,
  getAnthropicClient,
  estimateTokenCount,
  isApiKeyConfigured,
  DEFAULT_MODEL,
  DEFAULT_MAX_TOKENS,
} from './client';

export {
  SYSTEM_PROMPT,
  ANALYSIS_SYSTEM_PROMPT,
  TEST_GENERATION_SYSTEM_PROMPT,
  IMPACT_DETECTION_SYSTEM_PROMPT,
  CONTEXT_UPDATE_SYSTEM_PROMPT,
} from './prompts/system';

export {
  buildAnalyzeStoryPrompt,
  buildQuickAnalysisPrompt,
} from './prompts/analyze-story';

export {
  buildGenerateTestsPrompt,
  buildRegressionTestPrompt,
  type TestGenerationConfig,
} from './prompts/generate-tests';

export {
  buildDetectImpactPrompt,
  buildQuickImpactPrompt,
} from './prompts/detect-impact';

export {
  buildUpdateContextPrompt,
  buildPreviewUpdatePrompt,
} from './prompts/update-context';

export {
  createStreamingResponse,
  createJsonStreamingResponse,
  parseStreamingJson,
  collectStream,
  parseSSEStream,
} from './streaming';
