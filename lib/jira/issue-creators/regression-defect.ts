/**
 * REGRESSION DEFECT CREATOR
 *
 * Rules:
 * - Issue Type: "Defect"
 * - NO parent field (standalone — FAILS if parent is set)
 * - Labels: REQUIRED — must include ["regression-testing"]
 * - Summary format: "Regression - {ENV} - {Platform} - {Title}"
 * - Used for: Defects found during regression testing on preprod
 *
 * Custom Fields:
 * - Each field (Steps, Expected, Actual, etc.) goes to its own Jira custom field
 * - Description only contains the main description text
 */

import { createJiraIssue, textToADF } from '../client';
import {
  PROJECT_KEY,
  DEFECT_TYPE,
  SQUAD_FIELD_ID,
  DEFAULT_SQUAD,
  DEFAULT_COMPONENTS,
  PRIORITY_MAP,
  REGRESSION_LABELS,
} from '../fields-config';
import { buildCustomFields, buildDescription, type DefectFieldData, type JiraIssueType } from '../field-builder';

export type Environment = 'preprod' | 'staging' | 'UAT';
export type Platform = 'WebApp' | 'Mobile iOS' | 'Mobile Android' | 'API' | 'Super App';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface RegressionDefectParams {
  /** Short descriptive title */
  title: string;
  /** Detailed description */
  description: string;
  /** Steps to reproduce */
  stepsToReproduce?: string;
  /** Expected behavior */
  expectedBehavior?: string;
  /** Actual behavior */
  actualBehavior?: string;
  /** Environment where tested */
  environment: Environment;
  /** Platform */
  platform: Platform;
  /** Priority */
  priority: Priority;
  /** Module name */
  module?: string;
  /** Additional labels (will be merged with required ones) */
  extraLabels?: string[];
  /** Preconditions */
  preconditions?: string;
}

/**
 * Create a Regression Defect in Jira.
 * Summary format: Regression - {ENV} - {Platform} - {Title}
 * Labels: Must include 'regression-testing'
 *
 * Each field goes to its own Jira custom field:
 * - Steps to Reproduce → customfield_10389
 * - Expected Results → customfield_10390
 * - Actual Results → customfield_10388
 * - Precondition → customfield_10391
 * - Platform → customfield_10368
 * - Environment → customfield_10518
 */
export async function createRegressionDefect(
  params: RegressionDefectParams
): Promise<{ issueKey: string; url: string }> {
  // Build prefixed summary: Regression - PREPROD - WebApp - Payment fails
  const envLabel = params.environment.toUpperCase();
  const summary = `Regression - ${envLabel} - ${params.platform} - ${params.title}`;

  // Prepare field data for custom field mapping
  const fieldData: DefectFieldData = {
    stepsToReproduce: params.stepsToReproduce,
    expectedBehavior: params.expectedBehavior,
    actualBehavior: params.actualBehavior,
    environment: envLabel,
    preconditions: params.preconditions,
    platform: params.platform,
    module: params.module,
  };

  // Build custom fields - each goes to its own Jira field
  // Pass 'Defect' to ensure only Defect-compatible fields are included (includes Precondition, excludes Platform/Version/etc)
  const customFields = buildCustomFields(fieldData, 'Defect');

  // Build clean description (only module + main description)
  const descriptionText = buildDescription(params.description, fieldData);

  // REQUIRED labels for regression defects
  const labels = [...REGRESSION_LABELS, ...(params.extraLabels || [])];

  const fields: Record<string, unknown> = {
    project: { key: PROJECT_KEY },
    issuetype: { name: DEFECT_TYPE },
    summary,
    description: textToADF(descriptionText),
    priority: { name: PRIORITY_MAP[params.priority] || 'P2 - Medium' },
    labels, // REQUIRED — must have regression-testing
    // Required fields for CMB project
    components: DEFAULT_COMPONENTS.map((name) => ({ name })),
    [SQUAD_FIELD_ID]: { value: DEFAULT_SQUAD },
    // Spread custom fields - each value in its own field
    ...customFields,
  };

  // NO parent field — standalone issue
  // If parent is provided, it would cause Jira to REJECT the request

  return createJiraIssue(fields);
}
