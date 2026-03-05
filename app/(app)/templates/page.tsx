'use client';

import { useState, useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TemplateEditor,
  type PromptTemplate,
} from '@/components/templates/TemplateEditor';
import { Search, TestTubes, Bug, FileCode } from 'lucide-react';
import { toast } from 'sonner';

// Default templates
const defaultTemplates: Record<string, PromptTemplate> = {
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
    systemContext: `Define your custom system context here. This sets the role and behavior for the AI assistant.`,
    variables: ['custom_variable_1', 'custom_variable_2'],
    outputFormat: `Define your expected output format here. Use JSON or structured text as needed.`,
    isDefault: false,
  },
};

const templateTabs = [
  { id: 'story-analysis', label: 'Story Analysis', icon: Search },
  { id: 'test-cases', label: 'Test Cases', icon: TestTubes },
  { id: 'bug-report', label: 'Bug Report', icon: Bug },
  { id: 'custom', label: 'Custom', icon: FileCode },
];

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('story-analysis');
  const [templates, setTemplates] = useState<Record<string, PromptTemplate>>(
    () => ({ ...defaultTemplates })
  );
  const [originalTemplates] = useState<Record<string, PromptTemplate>>(
    () => ({ ...defaultTemplates })
  );
  const [isSaving, setIsSaving] = useState(false);

  const currentTemplate = templates[activeTab];

  const hasChanges = useMemo(() => {
    return JSON.stringify(templates[activeTab]) !== JSON.stringify(originalTemplates[activeTab]);
  }, [templates, originalTemplates, activeTab]);

  const handleTemplateChange = useCallback(
    (updated: PromptTemplate) => {
      setTemplates((prev) => ({
        ...prev,
        [activeTab]: updated,
      }));
    },
    [activeTab]
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: activeTab,
          template: templates[activeTab],
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save template');
      }

      toast.success('Template saved successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, [activeTab, templates]);

  const handleReset = useCallback(() => {
    setTemplates((prev) => ({
      ...prev,
      [activeTab]: { ...originalTemplates[activeTab] },
    }));
    toast.info('Template reset to default');
  }, [activeTab, originalTemplates]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Prompt Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize the prompts used for story analysis, test generation, and bug
          reports
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {templateTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {templateTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            <TemplateEditor
              template={templates[tab.id]}
              onChange={handleTemplateChange}
              onSave={handleSave}
              onReset={handleReset}
              isSaving={isSaving}
              hasChanges={hasChanges && activeTab === tab.id}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
