export interface TestGenerationConfig {
  includePositive?: boolean;
  includeNegative?: boolean;
  includeEdge?: boolean;
  includeBoundary?: boolean;
  includeRegression?: boolean;
  includeAccessibility?: boolean;
  includePerformance?: boolean;
  maxTestCases?: number;
}

export function buildGenerateTestsPrompt(
  story: string,
  context: string,
  options?: TestGenerationConfig
): string {
  const config: TestGenerationConfig = {
    includePositive: true,
    includeNegative: true,
    includeEdge: true,
    includeBoundary: true,
    includeRegression: true,
    includeAccessibility: false,
    includePerformance: false,
    maxTestCases: 20,
    ...options,
  };

  return `
${context}

<user_story>
${story}
</user_story>

<generation_config>
Include positive tests: ${config.includePositive}
Include negative tests: ${config.includeNegative}
Include edge case tests: ${config.includeEdge}
Include boundary tests: ${config.includeBoundary}
Include regression tests: ${config.includeRegression}
Include accessibility tests: ${config.includeAccessibility}
Include performance tests: ${config.includePerformance}
Maximum test cases: ${config.maxTestCases}
</generation_config>

Generate test cases for this user story. Return a JSON object:

{
  "story_summary": "Brief summary of what's being tested",
  "preconditions": [
    "User is logged in as B2B Business Admin",
    "Enterprise account is Active with Prepaid payment plan",
    "At least one group and one program exist"
  ],
  "test_data_suggestions": [
    {
      "field": "phone_number",
      "valid_examples": ["+213551234567", "+21612345678"],
      "invalid_examples": ["+1234567890", "abcdef", ""],
      "notes": "Only +213, +216, +212, +221 prefixes are supported"
    }
  ],
  "test_cases": [
    {
      "id": "TC-001",
      "title": "Verify successful user invitation by email",
      "type": "POSITIVE",
      "priority": "HIGH",
      "module": "b2b-users-groups",
      "preconditions": ["User is logged in as Business Admin", "Group 'Engineering' exists"],
      "steps": [
        {"step": 1, "action": "Navigate to Users & Groups > Invite Users", "expected": "Invite page is displayed with Group and Program dropdowns"},
        {"step": 2, "action": "Select 'Engineering' group and 'Standard' program", "expected": "Dropdowns show selected values"},
        {"step": 3, "action": "Enter 'newuser@company.com' in email field", "expected": "Email is accepted"},
        {"step": 4, "action": "Click 'Invite' button", "expected": "Success message displayed. User appears in Users list with 'Pending' status."}
      ],
      "expected_result": "New user receives invitation email and appears in the Users list with Pending status.",
      "traceability": "Requirement: Section 4.4 Users Tab > Inviting New Users"
    }
  ],
  "coverage_summary": {
    "positive": 5,
    "negative": 4,
    "edge_case": 3,
    "boundary": 2,
    "regression": 3,
    "total": 17
  }
}

IMPORTANT:
- Every test case MUST trace back to a specific requirement in the project context.
- Use EXACT field names, button labels, and status values from the project context.
- For negative tests, verify the SPECIFIC error behavior (not generic "error occurs").
- For boundary tests, use the ACTUAL limits from the context (e.g., 10MB file size, max 3 stops, 31-day export range).
- For regression tests, think about what EXISTING features could break if this story is implemented.
- Include country-specific tests where relevant (different weekend days, currencies, phone prefixes).
- Test IDs should be sequential: TC-001, TC-002, etc.
- Return ONLY the JSON object, no additional text.`;
}

export function buildRegressionTestPrompt(
  moduleId: string,
  context: string
): string {
  return `
${context}

Generate regression test cases for the module: ${moduleId}

Focus on:
1. Core functionality that must always work
2. Integration points with other modules
3. Edge cases that historically cause bugs
4. Country-specific behaviors

Return a JSON object with test_cases array following the same schema as above.
Return ONLY the JSON object.`;
}
