/**
 * PRODUCTION BUG CREATOR
 *
 * Rules:
 * - Issue Type: "Bug"
 * - NO parent field (standalone issue)
 * - Labels: optional
 * - Summary format: "[ALG] - {Platform} - PROD : {Title}"
 * - Used for: Production incidents reported by users or monitoring
 *
 * Custom Fields:
 * - Each field (Steps, Expected, Actual, etc.) goes to its own Jira custom field
 * - Description only contains the main description text
 */

import { createJiraIssue, textToADF } from '../client';
import {
  PROJECT_KEY,
  BUG_TYPE,
  SQUAD_FIELD_ID,
  DEFAULT_SQUAD,
  DEFAULT_COMPONENTS,
  PRIORITY_MAP,
} from '../fields-config';
import { buildCustomFields, buildDescription, type DefectFieldData, type JiraIssueType } from '../field-builder';

export type Platform = 'WebApp' | 'Mobile iOS' | 'Mobile Android' | 'API' | 'Super App';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface ProductionBugParams {
  /** Short descriptive title of the bug */
  title: string;
  /** Detailed description of the issue */
  description: string;
  /** Steps to reproduce */
  stepsToReproduce?: string;
  /** What was expected */
  expectedBehavior?: string;
  /** What actually happened */
  actualBehavior?: string;
  /** Platform where bug was found */
  platform: Platform;
  /** Severity/Priority */
  priority: Priority;
  /** Optional: environment details (staging, preprod, production) */
  environment?: string;
  /** Optional: additional labels */
  labels?: string[];
  /** Optional: module name for tracking */
  module?: string;
}

/**
 * Create a Production Bug in Jira.
 * Summary format: [ALG] - {Platform} - PROD : {Title}
 *
 * Each field goes to its own Jira custom field:
 * - Steps to Reproduce → customfield_10389
 * - Expected Results → customfield_10390
 * - Actual Results → customfield_10388
 * - Platform → customfield_10368
 * - Environment → customfield_10518
 */
export async function createProductionBug(
  params: ProductionBugParams
): Promise<{ issueKey: string; url: string }> {
  // Build prefixed summary: [ALG] - WebApp - PROD : Login button crashes
  const summary = `[ALG] - ${params.platform} - PROD : ${params.title}`;

  // Prepare field data for custom field mapping
  const fieldData: DefectFieldData = {
    stepsToReproduce: params.stepsToReproduce,
    expectedBehavior: params.expectedBehavior,
    actualBehavior: params.actualBehavior,
    environment: params.environment || 'Production',
    platform: params.platform,
    module: params.module,
  };

  // Build custom fields - each goes to its own Jira field
  // Pass 'Bug' to ensure only Bug-compatible fields are included
  const customFields = buildCustomFields(fieldData, 'Bug');

  // Build clean description (only module + main description, no Steps/Expected/Actual)
  const descriptionText = buildDescription(params.description, fieldData);

  const fields: Record<string, unknown> = {
    project: { key: PROJECT_KEY },
    issuetype: { name: BUG_TYPE },
    summary,
    description: textToADF(descriptionText),
    priority: { name: PRIORITY_MAP[params.priority] || 'P2 - Medium' },
    // Required fields for CMB project
    components: DEFAULT_COMPONENTS.map((name) => ({ name })),
    [SQUAD_FIELD_ID]: { value: DEFAULT_SQUAD },
    // Spread custom fields - each value in its own field
    ...customFields,
  };

  // Add labels if provided (but not required for bugs)
  if (params.labels && params.labels.length > 0) {
    fields.labels = params.labels;
  }

  // NO parent field — this is a standalone issue

  return createJiraIssue(fields);
}
