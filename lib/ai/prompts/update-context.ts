export function buildUpdateContextPrompt(
  story: string,
  currentModuleContent: string,
  changeType: string
): string {
  return `
<current_module_content>
${currentModuleContent}
</current_module_content>

<user_story>
${story}
</user_story>

<change_type>${changeType}</change_type>

Based on this user story, generate the UPDATED module content.

Return a JSON object:

{
  "module_id": "b2b-payments",
  "change_summary": "Added payment reference requirement for high-value prepaid top-ups.",
  "change_type": "${changeType}",

  "updated_content": "[FULL updated markdown content of the module, with changes applied]",

  "diff_description": [
    {
      "section": "Prepaid Account View > Top-up Option",
      "action": "ADDED" | "MODIFIED" | "REMOVED",
      "before": "The business has the option to top-up the budget amount by clicking 'Budget top-up'.",
      "after": "The business has the option to top-up the budget amount by clicking 'Budget top-up'. For amounts exceeding 50,000 DZD, a payment reference number is required."
    }
  ],

  "new_business_rules": [
    {
      "id": "PAY-NEW-001",
      "rule": "Payment reference is mandatory for prepaid top-ups exceeding 50,000 DZD",
      "module": "b2b-payments",
      "enforcement": "UI validation + API validation"
    }
  ],

  "removed_business_rules": [],

  "modified_business_rules": [],

  "change_log_entry": {
    "story_id": "[from the story if provided, otherwise null]",
    "change_type": "${changeType}",
    "module": "b2b-payments",
    "summary": "Added payment reference requirement for high-value prepaid top-ups (>50,000 DZD).",
    "sections_affected": ["Section 4.8 Payment Module > Prepaid Account View"]
  }
}

IMPORTANT:
- The updated_content must be COMPLETE — include ALL existing content plus changes.
- Do NOT remove any existing content unless the change_type is REMOVAL.
- Preserve the exact Markdown structure and frontmatter.
- Be surgical — only change what the story requires.
- Return ONLY the JSON object, no additional text.`;
}

export function buildPreviewUpdatePrompt(
  story: string,
  context: string
): string {
  return `
${context}

<user_story>
${story}
</user_story>

Identify which modules need to be updated based on this user story.

Return a JSON object:

{
  "affected_modules": [
    {
      "module_id": "module_id",
      "module_name": "Module Name",
      "change_summary": "Brief description of what needs to change",
      "sections_affected": ["Section 1", "Section 2"]
    }
  ],
  "new_modules_needed": [
    {
      "module_id": "new-module-id",
      "module_name": "New Module Name",
      "description": "Why this new module is needed"
    }
  ],
  "recommendation": "Brief recommendation on how to proceed"
}

Return ONLY the JSON object.`;
}
