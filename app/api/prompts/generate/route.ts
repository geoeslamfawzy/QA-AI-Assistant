import { NextRequest, NextResponse } from 'next/server';
import { fetchJiraTicket, isJiraConfigured } from '@/lib/jira';

interface TicketData {
  title: string;
  userStory: string;
  acceptanceCriteria: string[];
  description?: string;
  module?: string;
  type?: string;
}

function generateStoryAnalysisPrompt(data: {
  jiraTicket: {
    ticketId: string;
    title: string;
    userStory: string;
    acceptanceCriteria: string[];
    module: string;
  };
  figmaFrames?: { name: string }[];
  options: {
    ambiguity: boolean;
    testability: boolean;
    designGap: boolean;
    impactAnalysis: boolean;
  };
}) {
  const { jiraTicket, figmaFrames, options } = data;

  const analysisTypes = [];
  if (options.ambiguity) analysisTypes.push('ambiguity detection');
  if (options.testability) analysisTypes.push('testability classification');
  if (options.designGap) analysisTypes.push('design gap analysis');
  if (options.impactAnalysis) analysisTypes.push('impact analysis');

  const figmaSection = figmaFrames?.length
    ? `\n\n## Figma Frames\n${figmaFrames.map((f) => `- ${f.name}`).join('\n')}`
    : '';

  return `You are a senior QA engineer at Yassir Mobility. Analyze the following user story and provide detailed findings.

## Ticket: ${jiraTicket.ticketId}
**Title:** ${jiraTicket.title}
**Module:** ${jiraTicket.module}

## User Story
${jiraTicket.userStory}

## Acceptance Criteria
${jiraTicket.acceptanceCriteria.map((ac, i) => `${i + 1}. ${ac}`).join('\n')}
${figmaSection}

## Analysis Required
Perform the following types of analysis: ${analysisTypes.join(', ')}

## Output Format
Return your analysis as a JSON object with the following structure:
{
  "findings": [
    {
      "id": "F001",
      "type": "ambiguity" | "testability" | "design-gap" | "impact",
      "severity": "critical" | "high" | "medium" | "low",
      "title": "Brief title of the finding",
      "description": "Detailed description of the issue",
      "suggestion": "Recommended action to resolve"
    }
  ],
  "summary": "Overall assessment of story quality and readiness",
  "readiness_score": 0-100
}`;
}

function generateTestCasesPrompt(data: {
  ticketId?: string;
  ticketData?: TicketData;
  format: string;
  coverage: string[];
  additionalCriteria?: string;
}) {
  const { ticketId, ticketData, format, coverage, additionalCriteria } = data;

  // Always use BDD format for XRAY/Jira compatibility
  const formatNote =
    format === 'exploratory'
      ? 'Focus on exploratory testing charters while still using BDD structure.'
      : '';

  // Build the user story section if ticket data is available
  const userStorySection = ticketData
    ? `
## USER STORY TO TEST

**Ticket:** ${ticketId}
**Title:** ${ticketData.title}
**Module:** ${ticketData.module || 'Unknown'}
**Type:** ${ticketData.type || 'Story'}

**User Story:**
${ticketData.userStory}

**Acceptance Criteria:**
${ticketData.acceptanceCriteria.map((ac, i) => `${i + 1}. ${ac}`).join('\n')}
${ticketData.description ? `\n**Description:**\n${ticketData.description}` : ''}

Generate test cases that cover ALL acceptance criteria above. Each acceptance criterion should have at least one test case.
`
    : ticketId
      ? `
## NOTE
Ticket ID "${ticketId}" was provided but ticket data could not be fetched. Generate test cases based on the coverage types requested.
`
      : `
## NOTE
No Jira ticket provided. Generate generic test cases based on the coverage types requested.
`;

  return `You are a senior QA automation expert creating test cases for Yassir Mobility.

## Test Coverage Types
Generate comprehensive test cases for: ${coverage.join(', ')}

${additionalCriteria ? `## Additional Requirements\n${additionalCriteria}\n` : ''}

## CRITICAL FORMAT RULES

### 1. BDD Format (Given/When/Then)
All test cases MUST use BDD (Behavior-Driven Development) format for XRAY integration.

### 2. B1 English Level
Write in simple, clear, short statements. B1 English level means:
- Simple sentence structure
- Common vocabulary
- No complex or compound sentences
- Direct and to the point

### 3. Title Format
Each test case title MUST start with one of these words:
- **Verify** - for checking expected behavior
- **Validate** - for confirming data/input correctness
- **Test** - for general test scenarios

### 4. Structure
Each test case must include:
- **given**: Array of preconditions (context setup)
- **when**: Array of actions to perform (test steps)
- **then**: Array of expected outcomes (verifications)

${formatNote}

## EXAMPLE TEST CASE

{
  "id": "TC-001",
  "title": "Verify user can add one intermediate stop",
  "type": "functional",
  "priority": "high",
  "given": [
    "User is logged in as Business Admin",
    "User is on the Book Rides page",
    "The enterprise account is Active"
  ],
  "when": [
    "User clicks the Add Stop button",
    "User enters Algiers Airport in the stop field",
    "User selects the address from suggestions"
  ],
  "then": [
    "A new stop field appears between departure and destination",
    "The address autocomplete shows matching results",
    "The route on the map updates with the new stop",
    "The price estimate updates to reflect the new route"
  ],
  "preconditions": ["User is logged in as Business Admin", "User is on the Book Rides page"],
  "steps": ["Click Add Stop button", "Enter Algiers Airport", "Select address"],
  "expectedResult": "Stop is added and route updates correctly"
}

## OUTPUT FORMAT

Return ALL test cases as a JSON object with this structure:

\`\`\`json
{
  "test_cases": [
    {
      "id": "TC-NNN",
      "title": "Verify/Validate/Test [specific behavior]",
      "type": "functional|edge-case|negative|ui-ux|performance|security|accessibility",
      "priority": "critical|high|medium|low",
      "given": ["preconditions..."],
      "when": ["actions..."],
      "then": ["expected outcomes..."],
      "preconditions": ["same as given..."],
      "steps": ["same as when..."],
      "expectedResult": "summary"
    }
  ]
}
\`\`\`

IMPORTANT: Generate REAL test cases based on the user story below. Do NOT use placeholder text like "Precondition 1" or "Action 1".

## TYPE VALUES
- "functional" - Happy path, core functionality
- "edge-case" - Boundary conditions, limits
- "negative" - Invalid inputs, error handling
- "ui-ux" - Visual, usability, accessibility
- "performance" - Speed, load, response time
- "security" - Auth, permissions, data protection
- "accessibility" - Screen readers, keyboard navigation

## PRIORITY VALUES
- "critical" - Core functionality, blocking issues
- "high" - Important features, significant impact
- "medium" - Standard tests, moderate impact
- "low" - Nice-to-have, minor scenarios
${userStorySection}
## COVERAGE REQUIREMENTS

Generate as many test cases as needed to achieve COMPLETE coverage. Do not limit yourself to a specific number. Include:
- All happy path scenarios (functional)
- All edge cases and boundary conditions
- All negative scenarios (invalid inputs, error states, empty states)
- All corner cases and unusual combinations
- UI/UX validations where applicable
- Security considerations (permissions, data protection)

Cover EVERY acceptance criterion with at least one test case. Think through all possible user flows, error conditions, and edge cases. Quality and completeness matter more than quantity.`;
}

function generateBugReportPrompt(data: {
  module: string;
  severity: string;
  actualBehavior: string;
  expectedBehavior: string;
  stepsToReproduce?: string;
  browser?: string;
  environment?: string;
}) {
  return `You are a QA engineer creating a detailed bug report for Yassir Mobility.

## Bug Details
**Module:** ${data.module}
**Severity:** ${data.severity}

## What Happened (Actual Behavior)
${data.actualBehavior}

## What Should Happen (Expected Behavior)
${data.expectedBehavior}

${data.stepsToReproduce ? `## Steps to Reproduce\n${data.stepsToReproduce}` : ''}

## Environment
${data.browser ? `- Browser: ${data.browser}` : ''}
${data.environment ? `- Environment: ${data.environment}` : ''}

## Task
Create a well-structured bug report that includes:
1. A clear, concise title
2. Detailed description with context
3. Numbered steps to reproduce
4. Impact assessment
5. Potential root causes (if identifiable)

Return the bug report as formatted text suitable for Jira.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Prompt type is required' },
        { status: 400 }
      );
    }

    let prompt: string;

    switch (type) {
      case 'story-analysis':
        prompt = generateStoryAnalysisPrompt(data);
        break;

      case 'test-cases': {
        let ticketData: TicketData | undefined = data.ticketData;

        // If ticketId provided but no ticketData, try to fetch it
        if (data.ticketId && !ticketData && isJiraConfigured()) {
          try {
            const ticket = await fetchJiraTicket(data.ticketId);
            if (ticket) {
              ticketData = {
                title: ticket.title,
                userStory: ticket.userStory || '',
                acceptanceCriteria: ticket.acceptanceCriteria || [],
                description: ticket.userStory, // userStory serves as description
                module: ticket.module,
                type: ticket.type,
              };
            }
          } catch (err) {
            console.warn('[Prompt Generate] Failed to fetch ticket data:', err);
            // Continue without ticket data
          }
        }

        prompt = generateTestCasesPrompt({ ...data, ticketData });
        break;
      }

      case 'bug-report':
        prompt = generateBugReportPrompt(data);
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Unknown prompt type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      prompt,
      type,
    });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
