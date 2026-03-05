export function buildAnalyzeStoryPrompt(story: string, context: string): string {
  return `
${context}

<user_story>
${story}
</user_story>

Analyze this user story against the project context. Return a JSON object with this EXACT structure:

{
  "summary": "One-line summary of what this story describes",
  "classification": "NEW_FEATURE" | "REVAMP" | "REMOVAL" | "BUG_FIX" | "ENHANCEMENT",
  "affected_modules": [
    {
      "module_id": "b2b-dashboard",
      "module_name": "B2B Dashboard",
      "system": "B2B Corporate Portal",
      "relevance": "PRIMARY" | "SECONDARY" | "INDIRECT"
    }
  ],
  "completeness_score": 85,
  "completeness_breakdown": {
    "has_clear_goal": true,
    "has_acceptance_criteria": true,
    "has_user_role": true,
    "has_preconditions": false,
    "has_error_scenarios": false,
    "has_edge_cases": false,
    "has_data_requirements": true,
    "has_ui_specification": true
  },
  "ambiguities": [
    {
      "id": "AMB-001",
      "text": "The story says 'the user can filter' but doesn't specify which filter options.",
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "suggestion": "Specify the exact filter options: by status (Active/Pending), by date range, by group."
    }
  ],
  "missing_requirements": [
    {
      "id": "MIS-001",
      "description": "No mention of error handling when CSV upload fails.",
      "category": "ERROR_HANDLING" | "VALIDATION" | "SECURITY" | "PERFORMANCE" | "ACCESSIBILITY" | "I18N" | "BUSINESS_RULE",
      "suggested_addition": "Add acceptance criteria: 'When a malformed CSV is uploaded, the system displays an error with the row number and issue.'"
    }
  ],
  "context_conflicts": [
    {
      "id": "CON-001",
      "story_says": "Users can delete their own account",
      "context_says": "In section 4.4 Users Tab, users can only be deleted by clicking the delete icon (admin action). Self-deletion is not mentioned.",
      "recommendation": "Clarify if this is a new requirement or align with existing behavior."
    }
  ],
  "suggested_improvements": [
    "Add acceptance criteria for maximum file size validation (current limit: 10MB for PDF/JPEG/PNG).",
    "Specify behavior when the user's internet connection is lost during upload."
  ],
  "related_existing_features": [
    {
      "module": "b2b-users-groups",
      "feature": "CSV bulk invitation already exists and uses a template format.",
      "note": "Ensure the new story is compatible with the existing CSV template."
    }
  ]
}

IMPORTANT:
- Only reference modules and features that EXIST in the project context.
- If the story describes something completely new, set classification to NEW_FEATURE and note that it has no existing context.
- Score completeness honestly — a typical Jira story often scores 40-60%.
- Be specific in ambiguity descriptions — quote the exact problematic text.
- Return ONLY the JSON object, no additional text.`;
}

export function buildQuickAnalysisPrompt(story: string, context: string): string {
  return `
${context}

<user_story>
${story}
</user_story>

Provide a quick analysis of this user story. Return a JSON object:

{
  "summary": "One-line summary",
  "classification": "NEW_FEATURE" | "REVAMP" | "REMOVAL" | "BUG_FIX" | "ENHANCEMENT",
  "main_module": "module_id",
  "completeness_score": 0-100,
  "key_issues": ["List of 2-3 main issues or concerns"],
  "recommendation": "Brief recommendation for the story author"
}

Return ONLY the JSON object.`;
}
