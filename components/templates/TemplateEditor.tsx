'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, RotateCcw, Save, Loader2 } from 'lucide-react';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  systemContext: string;
  variables: string[];
  outputFormat: string;
  isDefault?: boolean;
}

interface TemplateEditorProps {
  template: PromptTemplate;
  onChange: (template: PromptTemplate) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export function TemplateEditor({
  template,
  onChange,
  onSave,
  onReset,
  isSaving = false,
  hasChanges = false,
}: TemplateEditorProps) {
  const updateField = <K extends keyof PromptTemplate>(
    field: K,
    value: PromptTemplate[K]
  ) => {
    onChange({ ...template, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          Template Editor
          {hasChanges && (
            <Badge variant="outline" className="ml-2 text-amber-500">
              Unsaved Changes
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Name */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Template Name</Label>
          <Input
            value={template.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. Story Analysis Template"
            className="text-sm"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Input
            value={template.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Brief description of this template's purpose"
            className="text-sm"
          />
        </div>

        {/* System Context */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">System Context</Label>
          <Textarea
            value={template.systemContext}
            onChange={(e) => updateField('systemContext', e.target.value)}
            placeholder="Define the AI's role and context..."
            className="min-h-[150px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            This sets the context for Claude when processing the prompt.
          </p>
        </div>

        {/* Variable Placeholders */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Variable Placeholders
          </Label>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable) => (
                <Badge
                  key={variable}
                  className="bg-accent-dim text-primary font-mono text-xs"
                >
                  {`{{${variable}}}`}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              These placeholders will be replaced with actual data when generating
              prompts. Add new variables by using {`{{variable_name}}`} syntax in your
              template.
            </p>
          </div>
        </div>

        {/* Output Format Instructions */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Output Format Instructions
          </Label>
          <Textarea
            value={template.outputFormat}
            onChange={(e) => updateField('outputFormat', e.target.value)}
            placeholder="Describe the expected output format..."
            className="min-h-[120px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Instructions for how Claude should structure its response.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={isSaving || !hasChanges}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={onSave} disabled={isSaving || !hasChanges}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
