export function buildDetectImpactPrompt(story: string, context: string): string {
  return `
${context}

<user_story>
${story}
</user_story>

Analyze the impact of implementing this user story on the existing system. Return a JSON object:

{
  "change_type": "NEW_FEATURE" | "REVAMP" | "REMOVAL",
  "risk_level": "HIGH" | "MEDIUM" | "LOW",
  "risk_justification": "This changes the payment flow which affects billing for all enterprises.",

  "affected_modules": [
    {
      "module_id": "b2b-payments",
      "module_name": "B2B Payments Module",
      "system": "B2B Corporate Portal",
      "impact_type": "DIRECT" | "INDIRECT" | "DEPENDENCY",
      "impact_description": "Payment confirmation flow needs to be updated to include the new field.",
      "risk": "HIGH" | "MEDIUM" | "LOW",
      "changes_required": [
        "Add new 'payment reference' field to top-up form",
        "Update validation schema to require reference for amounts > 50,000 DZD"
      ]
    }
  ],

  "affected_business_rules": [
    {
      "rule_id": "PAY-003",
      "current_rule": "Prepaid top-up requires amount + payment document/link",
      "proposed_change": "Add mandatory payment reference number for amounts exceeding 50,000 DZD",
      "breaking": true
    }
  ],

  "affected_ui_pages": [
    {
      "page": "B2B Portal > Payments > Top-up Modal",
      "change": "Add payment reference input field",
      "effort": "SMALL" | "MEDIUM" | "LARGE"
    }
  ],

  "affected_api_endpoints": [
    {
      "endpoint": "POST /api/v1/enterprises/:id/payments/topup",
      "change": "Add paymentReference to request body validation",
      "breaking_change": false
    }
  ],

  "dependency_chain": [
    "b2b-payments → b2b-dashboard (Financial Overview widget may need update)",
    "b2b-payments → admin-enterprise-payments (Admin top-up flow must match)",
    "b2b-payments → b2b-gift-cards (Gift card purchase uses same wallet)"
  ],

  "regression_test_recommendations": [
    {
      "area": "Prepaid top-up for amounts under 50,000 DZD",
      "reason": "Ensure existing flow still works without the new field",
      "priority": "HIGH"
    },
    {
      "area": "Gift card purchase",
      "reason": "Gift cards deduct from the same wallet — verify no side effects",
      "priority": "MEDIUM"
    }
  ],

  "estimated_effort": {
    "frontend": "SMALL" | "MEDIUM" | "LARGE",
    "backend": "SMALL" | "MEDIUM" | "LARGE",
    "testing": "SMALL" | "MEDIUM" | "LARGE",
    "total_story_points_estimate": 5
  }
}

IMPORTANT:
- Trace ALL dependencies using the module dependency information in the context.
- Identify BREAKING changes vs non-breaking changes.
- Consider the Admin Panel mirror — if B2B Portal changes, does the Admin Panel need matching changes?
- Consider country-specific impacts (e.g., does this affect all countries or just Algeria?).
- Rate effort honestly — don't underestimate.
- Return ONLY the JSON object, no additional text.`;
}

export function buildQuickImpactPrompt(story: string, context: string): string {
  return `
${context}

<user_story>
${story}
</user_story>

Provide a quick impact assessment. Return a JSON object:

{
  "change_type": "NEW_FEATURE" | "REVAMP" | "REMOVAL",
  "risk_level": "HIGH" | "MEDIUM" | "LOW",
  "risk_justification": "Brief explanation",
  "main_modules_affected": ["module_id_1", "module_id_2"],
  "breaking_changes": true | false,
  "estimated_story_points": 1-13,
  "key_risks": ["Risk 1", "Risk 2"]
}

Return ONLY the JSON object.`;
}
