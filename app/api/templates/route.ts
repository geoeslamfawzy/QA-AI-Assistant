import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const TEMPLATES_FILE = path.join(process.cwd(), 'templates.json');

// Default templates
const defaultTemplates = {
  'story-analysis': {
    id: 'story-analysis',
    name: 'Story Analysis Template',
    description: 'Analyze user stories for ambiguities, testability, and design gaps',
    systemContext: `You are a senior QA engineer at Yassir Mobility. Your task is to analyze user stories and acceptance criteria to identify:

1. **Ambiguities**: Unclear, vague, or conflicting requirements
2. **Testability Issues**: Criteria that cannot be effectively tested
3. **Design Gaps**: Missing UI/UX specifications or inconsistencies with Figma designs
4. **Impact Analysis**: Affected modules, APIs, and business rules

Use the provided project context to inform your analysis. Be specific and actionable in your findings.`,
    variables: [
      'ticket_id',
      'user_story',
      'acceptance_criteria',
      'figma_frames',
      'project_context',
    ],
    outputFormat: `Return your analysis in the following JSON structure:
{
  "findings": [
    {
      "id": "F001",
      "type": "ambiguity" | "testability" | "design-gap" | "impact",
      "severity": "critical" | "high" | "medium" | "low",
      "title": "Brief title",
      "description": "Detailed description of the issue",
      "suggestion": "Recommended action to resolve"
    }
  ],
  "summary": "Overall assessment of the story quality",
  "readiness_score": 0-100
}`,
    isDefault: true,
  },
  'test-cases': {
    id: 'test-cases',
    name: 'Test Case Generation Template',
    description: 'Generate comprehensive test cases from user stories',
    systemContext: `You are a QA automation expert creating test cases for Yassir Mobility. Generate test cases that cover:

1. **Functional Tests**: Core functionality verification
2. **Edge Cases**: Boundary conditions and unusual scenarios
3. **Negative Tests**: Error handling and invalid inputs
4. **UI/UX Tests**: Visual and interaction verification
5. **Performance Tests**: Response time and load considerations
6. **Accessibility Tests**: WCAG compliance checks

Use the project context to ensure test cases align with existing patterns and business rules.`,
    variables: [
      'ticket_id',
      'user_story',
      'acceptance_criteria',
      'test_format',
      'coverage_types',
    ],
    outputFormat: `Return test cases in the following JSON structure:
{
  "test_cases": [
    {
      "id": "TC001",
      "title": "Test case title",
      "type": "functional" | "edge-case" | "negative" | "ui-ux" | "performance" | "accessibility",
      "priority": "critical" | "high" | "medium" | "low",
      "preconditions": ["Precondition 1", "Precondition 2"],
      "steps": ["Step 1", "Step 2", "Step 3"],
      "expected_result": "Expected outcome"
    }
  ],
  "coverage_summary": {
    "total": 10,
    "by_type": { "functional": 4, "edge-case": 3, ... }
  }
}`,
    isDefault: true,
  },
  'bug-report': {
    id: 'bug-report',
    name: 'Bug Report Template',
    description: 'Generate structured bug reports for Jira',
    systemContext: `You are a QA engineer creating detailed bug reports for Yassir Mobility. Your bug reports should be:

1. **Clear**: Unambiguous description of the issue
2. **Reproducible**: Step-by-step instructions to replicate
3. **Impactful**: Business impact and affected users
4. **Actionable**: Enough detail for developers to investigate

Include relevant technical details and suggest potential root causes when possible.`,
    variables: [
      'module',
      'severity',
      'actual_behavior',
      'expected_behavior',
      'steps_to_reproduce',
      'environment',
    ],
    outputFormat: `Return the bug report in the following structure:
{
  "title": "Concise bug title",
  "description": "Detailed description",
  "steps_to_reproduce": ["Step 1", "Step 2"],
  "expected_result": "What should happen",
  "actual_result": "What actually happens",
  "environment": { "browser": "", "os": "", "env": "" },
  "severity": "critical" | "high" | "medium" | "low",
  "priority": "P1" | "P2" | "P3" | "P4",
  "affected_modules": ["Module 1"],
  "potential_causes": ["Cause 1"],
  "attachments": []
}`,
    isDefault: true,
  },
  custom: {
    id: 'custom',
    name: 'Custom Template',
    description: 'Create your own custom prompt template',
    systemContext: 'Define your custom system context here. This sets the role and behavior for the AI assistant.',
    variables: ['custom_variable_1', 'custom_variable_2'],
    outputFormat: 'Define your expected output format here. Use JSON or structured text as needed.',
    isDefault: false,
  },
};

async function readTemplates() {
  try {
    const data = await fs.readFile(TEMPLATES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, return defaults
    return defaultTemplates;
  }
}

async function writeTemplates(templates: typeof defaultTemplates) {
  await fs.writeFile(TEMPLATES_FILE, JSON.stringify(templates, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const templates = await readTemplates();
    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error('Error reading templates:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, template } = body;

    if (!templateId || !template) {
      return NextResponse.json(
        { success: false, error: 'Template ID and template data are required' },
        { status: 400 }
      );
    }

    // Read current templates
    const currentTemplates = await readTemplates();

    // Update the specific template
    const updatedTemplates = {
      ...currentTemplates,
      [templateId]: {
        ...currentTemplates[templateId],
        ...template,
        id: templateId, // Ensure ID consistency
      },
    };

    await writeTemplates(updatedTemplates);

    return NextResponse.json({
      success: true,
      template: updatedTemplates[templateId],
    });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
