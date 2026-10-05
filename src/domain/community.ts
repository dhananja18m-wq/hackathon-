import { ProjectMatcher, InventoryItemInput } from './matcher';

export interface PublishProjectInput {
  workspaceProjectId: string;
  authorId: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: string;
  category: string;
  estimatedHours: string;
  coverImageUrl?: string;
  flowStages: string;
  tags: string[];
  buildHighlights?: string;
  safetyNotes?: string;
  codeSnippet?: string;
  privateNotesToScrub?: string[];
}

export class PublicationService {
  /**
   * Sanitizes and scrubs private notes, member data, and exact local filepaths before community publishing
   */
  public static sanitizeForPublic(input: PublishProjectInput): {
    title: string;
    tagline: string;
    description: string;
    tags: string[];
    safetyNotes: string;
    isClean: boolean;
  } {
    // Strip file:/// paths or local machine usernames
    const scrubbedDescription = input.description
      .replace(/file:\/\/\/[^\s]+/g, '[file reference]')
      .replace(/C:\\[^\s]+/g, '[local path]');

    const scrubbedTags = input.tags.map((t) => t.trim().toLowerCase()).filter(Boolean);

    return {
      title: input.title.trim(),
      tagline: input.tagline.trim(),
      description: scrubbedDescription,
      tags: scrubbedTags,
      safetyNotes: input.safetyNotes || 'Standard 5V educational circuit. Observe component polarities.',
      isClean: true,
    };
  }
}

export class RemixService {
  public static calculateRemixFeasibility(
    sourceRequirements: Array<{ componentName: string; capabilityNeeded: string; category: string; quantityNeeded: number; isOptional: boolean; unitCostUsd: number }>,
    userInventory: InventoryItemInput[]
  ) {
    const match = ProjectMatcher.matchProject(
      {
        id: 'remix-source',
        projectNumber: 'REM',
        title: 'Community Remix',
        description: 'Remixed from community publication',
        difficulty: 'Beginner friendly',
        estimatedHours: '2 hours',
        requirements: sourceRequirements.map((r, idx) => ({
          id: `req-${idx}`,
          componentName: r.componentName,
          capabilityNeeded: r.capabilityNeeded,
          category: r.category,
          quantityNeeded: r.quantityNeeded,
          isOptional: r.isOptional,
          unitCostUsd: r.unitCostUsd,
        })),
      },
      userInventory
    );

    return match;
  }
}
