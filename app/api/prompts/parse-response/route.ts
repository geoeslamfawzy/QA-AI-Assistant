import { NextRequest, NextResponse } from 'next/server';
import type { BDDTestCase, TestCaseType, TestCasePriority } from '@/lib/test-cases/types';
import { ensureBDDFields, fixTestCaseTitle } from '@/lib/test-cases/formatter';

// ────────────────────────────────────
// JSON EXTRACTION
// ────────────────────────────────────

/**
 * Extract JSON from Claude's response.
 * Handles various formats: code blocks, raw JSON, or mixed content.
 */
function extractJsonFromResponse(response: string): unknown {
  console.log('[Extract Debug] Input length:', response?.length);

  // Try to find JSON in code blocks first
  const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    const jsonStr = codeBlockMatch[1].trim();
    try {
      const parsed = JSON.parse(jsonStr);
      console.log('[Extract Debug] Found JSON via code block, keys:', Object.keys(parsed));
      return parsed;
    } catch {
      // Continue to other methods
    }
  }

  // Try to find raw JSON object/array
  const trimmed = response.trim();

  // Look for JSON object
  if (trimmed.includes('{')) {
    const startIdx = trimmed.indexOf('{');
    let braceCount = 0;
    let endIdx = startIdx;

    for (let i = startIdx; i < trimmed.length; i++) {
      if (trimmed[i] === '{') braceCount++;
      if (trimmed[i] === '}') braceCount--;
      if (braceCount === 0) {
        endIdx = i + 1;
        break;
      }
    }

    if (endIdx > startIdx) {
      const jsonStr = trimmed.substring(startIdx, endIdx);
      try {
        const parsed = JSON.parse(jsonStr);
        console.log('[Extract Debug] Found JSON via brace matching, keys:', Object.keys(parsed));
        return parsed;
      } catch {
        // Continue to other methods
      }
    }
  }

  // Try parsing entire response as JSON
  try {
    const parsed = JSON.parse(trimmed);
    console.log('[Extract Debug] Found JSON via full parse, keys:', Object.keys(parsed));
    return parsed;
  } catch {
    console.log('[Extract Debug] FAILED to extract any JSON from response');
    console.log('[Extract Debug] Response preview:', trimmed.substring(0, 500));
    throw new Error('No valid JSON found in response. Please ensure the response contains a valid JSON object with test_cases array.');
  }
}

// ────────────────────────────────────
// TEST CASE NORMALIZATION
// ────────────────────────────────────

const VALID_TYPES: TestCaseType[] = [
  'functional',
  'edge-case',
  'negative',
  'ui-ux',
  'performance',
  'security',
  'accessibility',
];

const VALID_PRIORITIES: TestCasePriority[] = ['critical', 'high', 'medium', 'low'];

/**
 * Normalize test case type to valid value.
 */
function normalizeType(type: unknown): TestCaseType {
  if (typeof type !== 'string') return 'functional';

  const normalized = type.toLowerCase().replace(/[_\s]/g, '-');

  // Handle common variations
  const typeMap: Record<string, TestCaseType> = {
    functional: 'functional',
    'edge-case': 'edge-case',
    'edgecase': 'edge-case',
    edge: 'edge-case',
    boundary: 'edge-case',
    negative: 'negative',
    'ui-ux': 'ui-ux',
    ui: 'ui-ux',
    ux: 'ui-ux',
    usability: 'ui-ux',
    performance: 'performance',
    perf: 'performance',
    security: 'security',
    sec: 'security',
    accessibility: 'accessibility',
    a11y: 'accessibility',
  };

  return typeMap[normalized] || (VALID_TYPES.includes(normalized as TestCaseType) ? (normalized as TestCaseType) : 'functional');
}

/**
 * Normalize test case priority to valid value.
 */
function normalizePriority(priority: unknown): TestCasePriority {
  if (typeof priority !== 'string') return 'medium';

  const normalized = priority.toLowerCase();

  // Handle P0-P3 format
  const priorityMap: Record<string, TestCasePriority> = {
    p0: 'critical',
    p1: 'high',
    p2: 'medium',
    p3: 'low',
    critical: 'critical',
    high: 'high',
    medium: 'medium',
    low: 'low',
    highest: 'critical',
    lowest: 'low',
  };

  return priorityMap[normalized] || (VALID_PRIORITIES.includes(normalized as TestCasePriority) ? (normalized as TestCasePriority) : 'medium');
}

/**
 * Ensure value is a string array.
 */
function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  if (typeof value === 'string') {
    return value
      .split(/[\n;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Check if a test case is a placeholder/template that shouldn't be included.
 * Only filters EXACT matches to avoid rejecting real test cases.
 */
function isPlaceholderTestCase(tc: Record<string, unknown>): boolean {
  const title = String(tc.title || '').toLowerCase().trim();
  const given = Array.isArray(tc.given) ? tc.given.map(String) : [];
  const when = Array.isArray(tc.when) ? tc.when.map(String) : [];
  const preconditions = Array.isArray(tc.preconditions) ? tc.preconditions.map(String) : [];
  const steps = Array.isArray(tc.steps) ? tc.steps.map(String) : [];

  // EXACT placeholder title matches only (from prompt template)
  const PLACEHOLDER_TITLES = [
    'verify [action/behavior in simple english]',
    'verify/validate/test [specific behavior]',
    'verify/validate/test ... (descriptive title)',
    'test case title',
  ];
  if (PLACEHOLDER_TITLES.includes(title)) return true;

  // Check for exact placeholder arrays - must match EXACTLY
  const allPreconditions = [...given, ...preconditions];
  const allSteps = [...when, ...steps];

  // Only reject if the FIRST item is exactly a placeholder
  const PLACEHOLDER_PRECONDITIONS = ['precondition 1', 'preconditions...', 'precondition statements...'];
  const PLACEHOLDER_STEPS = ['action 1', 'step 1', 'actions...', 'action steps...'];

  if (
    allPreconditions.length > 0 &&
    PLACEHOLDER_PRECONDITIONS.includes(allPreconditions[0].toLowerCase().trim())
  ) {
    return true;
  }

  if (
    allSteps.length > 0 &&
    PLACEHOLDER_STEPS.includes(allSteps[0].toLowerCase().trim())
  ) {
    return true;
  }

  return false;
}

/**
 * Normalize a raw test case object to BDDTestCase.
 */
function normalizeTestCase(raw: Record<string, unknown>, index: number): BDDTestCase {
  // Generate ID if missing
  const id = typeof raw.id === 'string' ? raw.id : `TC-${String(index + 1).padStart(3, '0')}`;

  // Get and fix title
  let title = typeof raw.title === 'string' ? raw.title : `Test Case ${index + 1}`;
  title = fixTestCaseTitle(title);

  // Normalize type and priority
  const type = normalizeType(raw.type);
  const priority = normalizePriority(raw.priority);

  // Handle BDD fields
  const given = ensureStringArray(raw.given);
  const when = ensureStringArray(raw.when);
  const then = ensureStringArray(raw.then);

  // Handle legacy fields
  const preconditions = ensureStringArray(raw.preconditions);
  const steps = ensureStringArray(raw.steps);
  const expectedResult =
    typeof raw.expectedResult === 'string'
      ? raw.expectedResult
      : typeof raw.expected_result === 'string'
        ? raw.expected_result
        : '';

  // Build the test case with BDD fields populated
  const testCase: Partial<BDDTestCase> = {
    id,
    title,
    type,
    priority,
    given: given.length > 0 ? given : preconditions,
    when: when.length > 0 ? when : steps,
    then: then.length > 0 ? then : expectedResult ? [expectedResult] : [],
    preconditions: preconditions.length > 0 ? preconditions : given,
    steps: steps.length > 0 ? steps : when,
    expectedResult: expectedResult || then.join('; '),
  };

  return ensureBDDFields(testCase);
}

// ────────────────────────────────────
// STORY ANALYSIS TYPES
// ────────────────────────────────────

type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';
type FindingType = 'ambiguity' | 'testability' | 'design-gap' | 'impact';

interface Finding {
  id: string;
  type: FindingType;
  severity: FindingSeverity;
  title: string;
  description: string;
  suggestion?: string;
}

/**
 * Normalize finding type to valid value.
 */
function normalizeFindingType(type: unknown): FindingType {
  if (typeof type !== 'string') return 'ambiguity';
  const normalized = type.toLowerCase().replace(/[_\s]/g, '-');
  const validTypes: FindingType[] = ['ambiguity', 'testability', 'design-gap', 'impact'];
  return validTypes.includes(normalized as FindingType) ? (normalized as FindingType) : 'ambiguity';
}

/**
 * Normalize finding severity to valid value.
 */
function normalizeFindingSeverity(severity: unknown): FindingSeverity {
  if (typeof severity !== 'string') return 'medium';
  const normalized = severity.toLowerCase();
  const validSeverities: FindingSeverity[] = ['critical', 'high', 'medium', 'low'];
  return validSeverities.includes(normalized as FindingSeverity) ? (normalized as FindingSeverity) : 'medium';
}

/**
 * Normalize a raw finding object.
 */
function normalizeFinding(raw: Record<string, unknown>, index: number): Finding {
  return {
    id: typeof raw.id === 'string' ? raw.id : `F${String(index + 1).padStart(3, '0')}`,
    type: normalizeFindingType(raw.type),
    severity: normalizeFindingSeverity(raw.severity),
    title: typeof raw.title === 'string' ? raw.title : `Finding ${index + 1}`,
    description: typeof raw.description === 'string' ? raw.description : '',
    suggestion: typeof raw.suggestion === 'string' ? raw.suggestion : undefined,
  };
}

// ────────────────────────────────────
// API HANDLER
// ────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, response } = body;

    // DEBUG LOGGING
    console.log('[Parse Debug] Received type:', type);
    console.log('[Parse Debug] Response length:', response?.length);
    console.log('[Parse Debug] Response first 300 chars:', response?.substring(0, 300));
    console.log('[Parse Debug] Response last 200 chars:', response?.substring(response?.length - 200));

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Response type is required' },
        { status: 400 }
      );
    }

    if (!response) {
      return NextResponse.json(
        { success: false, error: 'Response text is required' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'test-cases': {
        try {
          // Parse the actual Claude response
          const parsed = extractJsonFromResponse(response);
          const data = parsed as { test_cases?: unknown[] };

          if (!data.test_cases || !Array.isArray(data.test_cases)) {
            return NextResponse.json(
              {
                success: false,
                error:
                  'Response must contain a "test_cases" array. Please check the JSON structure.',
              },
              { status: 400 }
            );
          }

          // Filter out placeholder/template test cases
          const validCases = data.test_cases.filter(
            (tc) => !isPlaceholderTestCase(tc as Record<string, unknown>)
          );

          // DEBUG LOGGING
          console.log('[Parse Debug] data.test_cases count:', data.test_cases?.length);
          console.log('[Parse Debug] First test case:', JSON.stringify(data.test_cases?.[0])?.substring(0, 300));
          console.log('[Parse Debug] validCases count after filter:', validCases.length);
          if (data.test_cases?.length > 0 && validCases.length === 0) {
            console.log('[Parse Debug] ALL test cases filtered out! Checking why...');
            data.test_cases.forEach((tc, i) => {
              const testCase = tc as Record<string, unknown>;
              const isPlaceholder = isPlaceholderTestCase(testCase);
              console.log(`[Parse Debug] TC ${i}: "${String(testCase.title || '').substring(0, 50)}" - isPlaceholder: ${isPlaceholder}`);
            });
          }

          if (validCases.length === 0) {
            // Check if this looks like the prompt template was pasted instead of Claude's response
            const firstTitle = String((data.test_cases[0] as Record<string, unknown>)?.title || '').toLowerCase();
            const looksLikePromptTemplate =
              firstTitle.includes('[specific behavior]') ||
              firstTitle.includes('[action/behavior') ||
              response.includes('You are a senior QA') ||
              response.includes('## OUTPUT FORMAT');

            const errorMessage = looksLikePromptTemplate
              ? 'It looks like you pasted the PROMPT instead of Claude\'s response. Please copy the prompt to Claude first, then paste Claude\'s JSON response (not the prompt) into this field.'
              : 'No valid test cases found. The response may only contain template placeholders. Please ensure Claude generates real test cases.';

            return NextResponse.json(
              {
                success: false,
                error: errorMessage,
              },
              { status: 400 }
            );
          }

          // Normalize all valid test cases
          const testCases = validCases.map((tc, index) =>
            normalizeTestCase(tc as Record<string, unknown>, index)
          );

          // Calculate coverage summary
          const coverageSummary = {
            total: testCases.length,
            byType: testCases.reduce(
              (acc, tc) => {
                acc[tc.type] = (acc[tc.type] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>
            ),
          };

          return NextResponse.json({
            success: true,
            testCases,
            coverageSummary,
          });
        } catch (parseError) {
          return NextResponse.json(
            {
              success: false,
              error:
                parseError instanceof Error
                  ? parseError.message
                  : 'Failed to parse test cases from response',
            },
            { status: 400 }
          );
        }
      }

      case 'story-analysis': {
        try {
          // Parse the actual Claude response
          const parsed = extractJsonFromResponse(response);
          const data = parsed as {
            findings?: unknown[];
            summary?: string;
            readiness_score?: number;
          };

          // Normalize findings
          const findings: Finding[] = Array.isArray(data.findings)
            ? data.findings.map((f, index) =>
                normalizeFinding(f as Record<string, unknown>, index)
              )
            : [];

          return NextResponse.json({
            success: true,
            findings,
            summary: typeof data.summary === 'string' ? data.summary : '',
            readinessScore: typeof data.readiness_score === 'number' ? data.readiness_score : 0,
          });
        } catch (parseError) {
          return NextResponse.json(
            {
              success: false,
              error:
                parseError instanceof Error
                  ? parseError.message
                  : 'Failed to parse story analysis from response',
            },
            { status: 400 }
          );
        }
      }

      case 'bug-report':
        return NextResponse.json({
          success: true,
          formattedReport: `## Bug Report

**Module:** ${body.module || 'Unknown'}
**Severity:** ${body.severity || 'P2 - Medium'}

### Description
${response.substring(0, 500)}...

_Parsed from Claude response_`,
        });

      default:
        return NextResponse.json(
          { success: false, error: `Unknown response type: ${type}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error parsing response:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
