/**
 * Field Builder Utility
 *
 * Builds Jira field values in the correct format for each field type.
 * Maps data to custom fields and creates clean descriptions.
 */

import { JIRA_FIELDS, type FieldType, getJiraPlatformValue } from './fields-config';
import { textToADF } from './client';

// ════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════

/**
 * Jira issue types that have different field availability.
 * - Bug: Has Platform, Version, Country, Region, Business Impact, Additional Info
 * - Defect: Has Precondition only (no Platform/Version/etc)
 * - Story Defect: Has Precondition only (no Platform/Version/etc)
 */
export type JiraIssueType = 'Bug' | 'Defect' | 'Story Defect';

/**
 * Input data for building custom fields.
 */
export interface DefectFieldData {
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  environment?: string;
  platform?: string;
  preconditions?: string;
  module?: string;
  businessImpact?: string;
  version?: string;
  country?: string;
  region?: string;
  additionalInfo?: string;
}

// ════════════════════════════════════════════════════════════════
// VALUE FORMATTING
// ════════════════════════════════════════════════════════════════

/**
 * Format a value based on field type.
 *
 * - 'string': returns plain string
 * - 'adf': returns Atlassian Document Format object
 * - 'option': returns { value: "text" }
 * - 'array-option': returns [{ value: "text" }]
 */
function formatValue(value: string, fieldType: FieldType): unknown {
  if (!value || value.trim() === '') return undefined;

  switch (fieldType) {
    case 'string':
      return value;
    case 'adf':
      return textToADF(value);
    case 'option':
      return { value };
    case 'array-option':
      return [{ value }];
    default:
      return value;
  }
}

// ════════════════════════════════════════════════════════════════
// BUILD CUSTOM FIELDS
// ════════════════════════════════════════════════════════════════

/**
 * Build custom fields object for Jira payload.
 * Maps input data to the correct custom field IDs with proper formatting.
 *
 * IMPORTANT: Different issue types have different fields available:
 * - Bug: Steps, Expected, Actual, Environment, Platform, Version, Business Impact, Country, Region, Additional Info
 * - Defect: Steps, Expected, Actual, Environment, Precondition
 * - Story Defect: Steps, Expected, Actual, Environment, Precondition
 *
 * @param data - Field data to map
 * @param issueType - Jira issue type to determine which fields are available (default: 'Bug')
 * @returns Object with field keys ready to spread into Jira payload
 */
export function buildCustomFields(
  data: DefectFieldData,
  issueType: JiraIssueType = 'Bug'
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  // Fields available on ALL issue types (Bug, Defect, Story Defect)
  const commonMappings: Array<{
    value: string | undefined;
    field: { id: string; type: FieldType };
  }> = [
    { value: data.stepsToReproduce, field: JIRA_FIELDS.STEPS_TO_REPRODUCE },
    { value: data.expectedBehavior, field: JIRA_FIELDS.EXPECTED_RESULTS },
    { value: data.actualBehavior, field: JIRA_FIELDS.ACTUAL_RESULTS },
    { value: data.environment, field: JIRA_FIELDS.ENVIRONMENT },
  ];

  // Fields ONLY available on Bug issue type
  // NOTE: Platform value must be mapped to Jira's allowed values (Android, iOS, Web)
  const bugOnlyMappings: Array<{
    value: string | undefined;
    field: { id: string; type: FieldType };
  }> = [
    { value: data.platform ? getJiraPlatformValue(data.platform) : undefined, field: JIRA_FIELDS.PLATFORM },
    { value: data.businessImpact, field: JIRA_FIELDS.BUSINESS_IMPACT },
    { value: data.version, field: JIRA_FIELDS.VERSION },
    { value: data.country, field: JIRA_FIELDS.COUNTRY },
    { value: data.region, field: JIRA_FIELDS.REGION },
    { value: data.additionalInfo, field: JIRA_FIELDS.ADDITIONAL_INFO },
  ];

  // Fields ONLY available on Defect and Story Defect issue types
  const defectOnlyMappings: Array<{
    value: string | undefined;
    field: { id: string; type: FieldType };
  }> = [
    { value: data.preconditions, field: JIRA_FIELDS.PRECONDITION },
  ];

  // Apply common mappings (available on all issue types)
  for (const { value, field } of commonMappings) {
    if (!value || value.trim() === '') continue;
    const formatted = formatValue(value, field.type);
    if (formatted !== undefined) {
      result[field.id] = formatted;
    }
  }

  // Apply issue-type-specific mappings
  if (issueType === 'Bug') {
    // Bug has Platform, Version, Country, etc. but NOT Precondition
    for (const { value, field } of bugOnlyMappings) {
      if (!value || value.trim() === '') continue;
      const formatted = formatValue(value, field.type);
      if (formatted !== undefined) {
        result[field.id] = formatted;
      }
    }
  } else {
    // Defect and Story Defect have Precondition but NOT Platform, Version, etc.
    for (const { value, field } of defectOnlyMappings) {
      if (!value || value.trim() === '') continue;
      const formatted = formatValue(value, field.type);
      if (formatted !== undefined) {
        result[field.id] = formatted;
      }
    }
  }

  return result;
}

// ════════════════════════════════════════════════════════════════
// BUILD DESCRIPTION
// ════════════════════════════════════════════════════════════════

/**
 * Build a clean description that ONLY contains the actual description text.
 *
 * Since all fields are now mapped to their own custom fields,
 * the description only contains the main description text.
 * Module is NOT a Jira field, so it's included in the description.
 *
 * @param mainDescription - The main description text
 * @param data - Field data (module will be included if present)
 * @returns Plain text description string
 */
export function buildDescription(
  mainDescription: string,
  data: DefectFieldData
): string {
  const parts: string[] = [];

  // Include module in description since there's no Module custom field
  if (data.module) {
    parts.push(`*Module:* ${data.module}`);
    parts.push('');
  }

  // Add main description
  if (mainDescription && mainDescription.trim()) {
    parts.push(mainDescription.trim());
  }

  return parts.join('\n') || 'No description provided';
}

/**
 * Build a full description with all fields (fallback mode).
 * Use this when custom fields fail to populate.
 *
 * @param mainDescription - The main description text
 * @param data - All field data
 * @returns Plain text description with all fields formatted
 */
export function buildFullDescription(
  mainDescription: string,
  data: DefectFieldData
): string {
  const parts: string[] = [];

  // Header fields
  if (data.module) {
    parts.push(`*Module:* ${data.module}`);
  }
  if (data.platform) {
    parts.push(`*Platform:* ${data.platform}`);
  }
  if (data.environment) {
    parts.push(`*Environment:* ${data.environment}`);
  }

  // Main description
  if (mainDescription && mainDescription.trim()) {
    parts.push('');
    parts.push('*Description:*');
    parts.push(mainDescription.trim());
  }

  // Preconditions
  if (data.preconditions) {
    parts.push('');
    parts.push('*Preconditions:*');
    parts.push(data.preconditions);
  }

  // Steps to reproduce
  if (data.stepsToReproduce) {
    parts.push('');
    parts.push('*Steps to Reproduce:*');
    parts.push(data.stepsToReproduce);
  }

  // Expected behavior
  if (data.expectedBehavior) {
    parts.push('');
    parts.push('*Expected Behavior:*');
    parts.push(data.expectedBehavior);
  }

  // Actual behavior
  if (data.actualBehavior) {
    parts.push('');
    parts.push('*Actual Behavior:*');
    parts.push(data.actualBehavior);
  }

  // Additional info
  if (data.additionalInfo) {
    parts.push('');
    parts.push('*Additional Information:*');
    parts.push(data.additionalInfo);
  }

  return parts.join('\n') || 'No description provided';
}

// ════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ════════════════════════════════════════════════════════════════

/**
 * Check if any custom fields have values.
 */
export function hasCustomFieldValues(data: DefectFieldData): boolean {
  return !!(
    data.stepsToReproduce ||
    data.expectedBehavior ||
    data.actualBehavior ||
    data.preconditions ||
    data.environment ||
    data.platform ||
    data.businessImpact ||
    data.version ||
    data.country ||
    data.region ||
    data.additionalInfo
  );
}

/**
 * Get list of custom field IDs that will be populated.
 */
export function getPopulatedFieldIds(data: DefectFieldData): string[] {
  const ids: string[] = [];

  if (data.stepsToReproduce) ids.push(JIRA_FIELDS.STEPS_TO_REPRODUCE.id);
  if (data.expectedBehavior) ids.push(JIRA_FIELDS.EXPECTED_RESULTS.id);
  if (data.actualBehavior) ids.push(JIRA_FIELDS.ACTUAL_RESULTS.id);
  if (data.preconditions) ids.push(JIRA_FIELDS.PRECONDITION.id);
  if (data.environment) ids.push(JIRA_FIELDS.ENVIRONMENT.id);
  if (data.platform) ids.push(JIRA_FIELDS.PLATFORM.id);
  if (data.businessImpact) ids.push(JIRA_FIELDS.BUSINESS_IMPACT.id);
  if (data.version) ids.push(JIRA_FIELDS.VERSION.id);
  if (data.country) ids.push(JIRA_FIELDS.COUNTRY.id);
  if (data.region) ids.push(JIRA_FIELDS.REGION.id);
  if (data.additionalInfo) ids.push(JIRA_FIELDS.ADDITIONAL_INFO.id);

  return ids;
}
