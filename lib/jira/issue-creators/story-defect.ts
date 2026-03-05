/**
 * STORY DEFECT CREATOR
 *
 * Rules:
 * - Issue Type: "Story Defect" (this is a sub-task type in Jira)
 * - Parent: REQUIRED — must reference the parent story key
 * - Labels: NO labels (must NOT include labels)
 * - Summary: NO prefix (clean title only)
 * - Used for: Defects found during sprint testing on a specific story
 *
 * NOTE: "Story Defect" must be configured as a sub-task issue type in your
 * Jira project. If it doesn't exist, the API will return an error.
 *
 * Custom Fields:
 * - Each field (Steps, Expected, Actual, etc.) goes to its own Jira custom field
 * - Description only contains the main description text
 */

import { createJiraIssue, textToADF } from '../client';
import {
  PROJECT_KEY,
  STORY_DEFECT_TYPE,
  SQUAD_FIELD_ID,
  DEFAULT_SQUAD,
  DEFAULT_COMPONENTS,
  PRIORITY_MAP,
} from '../fields-config';
import { buildCustomFields, buildDescription, type DefectFieldData, type JiraIssueType } from '../field-builder';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface StoryDefectParams {
  /** Short descriptive title — NO prefix */
  title: string;
  /** Parent story key — REQUIRED (e.g., "CMB-32860") */
  parentStoryKey: string;
  /** Detailed description */
  description: string;
  /** Steps to reproduce */
  stepsToReproduce?: string;
  /** Expected behavior */
  expectedBehavior?: string;
  /** Actual behavior */
  actualBehavior?: string;
  /** Priority */
  priority: Priority;
  /** Module name */
  module?: string;
  /** Environment details */
  environment?: string;
  /** Preconditions */
  preconditions?: string;
}

/**
 * Create a Story Defect (sub-task) in Jira.
 * This is a sub-task that must be attached to a parent story.
 * Summary: Clean title only, NO prefix.
 * Labels: NONE.
 *
 * Each field goes to its own Jira custom field:
 * - Steps to Reproduce → customfield_10389
 * - Expected Results → customfield_10390
 * - Actual Results → customfield_10388
 * - Precondition → customfield_10391
 * - Environment → customfield_10518
 */
export async function createStoryDefect(
  params: StoryDefectParams
): Promise<{ issueKey: string; url: string }> {
  if (!params.parentStoryKey) {
    throw new Error(
      'Story Defect REQUIRES a parent story key. This is a sub-task and must be attached to a story.'
    );
  }

  // NO prefix — clean title only
  const summary = params.title;

  // Prepare field data for custom field mapping
  const fieldData: DefectFieldData = {
    stepsToReproduce: params.stepsToReproduce,
    expectedBehavior: params.expectedBehavior,
    actualBehavior: params.actualBehavior,
    environment: params.environment,
    preconditions: params.preconditions,
    module: params.module,
  };

  // Build custom fields - each goes to its own Jira field
  // Pass 'Story Defect' to ensure only Story Defect-compatible fields are included (includes Precondition, excludes Platform/Version/etc)
  const customFields = buildCustomFields(fieldData, 'Story Defect');

  // Build clean description (module + main description)
  // Include parent story reference in description
  const mainDescription = `*Parent Story:* ${params.parentStoryKey}\n\n${params.description}`;
  const descriptionText = buildDescription(mainDescription, fieldData);

  const fields: Record<string, unknown> = {
    project: { key: PROJECT_KEY },
    issuetype: { name: STORY_DEFECT_TYPE }, // Sub-task type
    summary,
    description: textToADF(descriptionText),
    priority: { name: PRIORITY_MAP[params.priority] || 'P2 - Medium' },
    parent: { key: params.parentStoryKey }, // REQUIRED — sub-task attachment
    // Required fields for CMB project
    components: DEFAULT_COMPONENTS.map((name) => ({ name })),
    [SQUAD_FIELD_ID]: { value: DEFAULT_SQUAD },
    // Spread custom fields - each value in its own field
    ...customFields,
    // NO labels field — Story Defects must NOT have labels
  };

  return createJiraIssue(fields);
}
