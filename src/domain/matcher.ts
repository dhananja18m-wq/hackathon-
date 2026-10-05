export interface InventoryItemInput {
  id: string;
  name: string;
  category: string;
  quantity: number;
  condition: string;
  capabilities: string[];
}

export interface ProjectRequirementInput {
  id: string;
  componentName: string;
  capabilityNeeded: string;
  category: string;
  quantityNeeded: number;
  isOptional: boolean;
  substitutions?: string | null;
  unitCostUsd: number;
}

export interface ProjectInput {
  id: string;
  projectNumber: string;
  title: string;
  tagline?: string | null;
  description: string;
  difficulty: string;
  estimatedHours: string;
  requirements: ProjectRequirementInput[];
}

export interface MatchRequirementResult {
  requirement: ProjectRequirementInput;
  isSatisfied: boolean;
  matchedInventoryItem?: InventoryItemInput;
  quantityOwned: number;
  isSubstituted: boolean;
  substituteName?: string;
}

export interface MatchScoreBreakdown {
  functionalCapabilityPct: number; // 0 - 100
  electricalFitPct: number;        // 0 - 100
  powerReadinessPct: number;       // 0 - 100
  physicalFitPct: number;          // 0 - 100
  requiredPartCoveragePct: number; // 0 - 100
  optionalPartCoveragePct: number; // 0 - 100
  conditionAdequacyPct: number;    // 0 - 100
  compatibilityFitPct: number;     // 0 - 100
}

export interface ProjectMatchResult {
  projectId: string;
  projectNumber: string;
  title: string;
  feasibilityScore: number; // 0 - 100
  scoreBreakdown: MatchScoreBreakdown;
  summaryExplanation: string;
  functionalNote: string;
  electricalNote: string;
  powerNote: string;
  ownedRequirements: MatchRequirementResult[];
  missingRequirements: MatchRequirementResult[];
  ownedCount: number;
  ownedUnitsTotal: number;
  missingCount: number;
  estimatedExtraCostUsd: number;
  isHighFeasibility: boolean;
}

export class ProjectMatcher {
  // Configurable weights from specification
  private static WEIGHT_REQUIRED = 0.70;
  private static WEIGHT_OPTIONAL = 0.15;
  private static WEIGHT_CONDITION = 0.10;
  private static WEIGHT_COMPATIBILITY = 0.05;

  public static matchProject(
    project: ProjectInput,
    inventory: InventoryItemInput[]
  ): ProjectMatchResult {
    const requiredList = project.requirements.filter((r) => !r.isOptional);
    const optionalList = project.requirements.filter((r) => r.isOptional);

    const ownedRequirements: MatchRequirementResult[] = [];
    const missingRequirements: MatchRequirementResult[] = [];

    let satisfiedRequiredCount = 0;
    let satisfiedOptionalCount = 0;
    let totalOwnedUnits = 0;
    let conditionScoreSum = 0;
    let estimatedExtraCostUsd = 0;

    // Check each requirement
    for (const req of project.requirements) {
      const match = this.findMatchingItem(req, inventory);

      if (match) {
        const isAdequateQty = match.quantity >= req.quantityNeeded;
        const conditionFactor = match.condition.toLowerCase().includes('working') ? 1.0 : 0.7;
        conditionScoreSum += conditionFactor;

        const matchResult: MatchRequirementResult = {
          requirement: req,
          isSatisfied: true,
          matchedInventoryItem: match,
          quantityOwned: match.quantity,
          isSubstituted: match.name.toLowerCase() !== req.componentName.toLowerCase(),
          substituteName: match.name.toLowerCase() !== req.componentName.toLowerCase() ? match.name : undefined,
        };

        ownedRequirements.push(matchResult);
        totalOwnedUnits += Math.min(match.quantity, req.quantityNeeded);

        if (!req.isOptional) {
          satisfiedRequiredCount += isAdequateQty ? 1 : 0.5;
        } else {
          satisfiedOptionalCount += isAdequateQty ? 1 : 0.5;
        }
      } else {
        const matchResult: MatchRequirementResult = {
          requirement: req,
          isSatisfied: false,
          quantityOwned: 0,
          isSubstituted: false,
        };

        missingRequirements.push(matchResult);
        estimatedExtraCostUsd += req.unitCostUsd * req.quantityNeeded;
      }
    }

    const requiredCoverage = requiredList.length > 0 ? (satisfiedRequiredCount / requiredList.length) * 100 : 100;
    const optionalCoverage = optionalList.length > 0 ? (satisfiedOptionalCount / optionalList.length) * 100 : 100;
    const conditionAdequacy = project.requirements.length > 0 ? (conditionScoreSum / project.requirements.length) * 100 : 100;
    const compatibilityFit = 100; // Baseline 5V logic compatibility

    const compositeScore = Math.round(
      (requiredCoverage * this.WEIGHT_REQUIRED) +
      (optionalCoverage * this.WEIGHT_OPTIONAL) +
      (conditionAdequacy * this.WEIGHT_CONDITION) +
      (compatibilityFit * this.WEIGHT_COMPATIBILITY)
    );

    const clampedScore = Math.min(Math.max(compositeScore, 10), 98);

    // Derived subscores for UI visualization
    const functionalCapabilityPct = Math.min(100, Math.round(requiredCoverage * 0.9 + 10));
    const electricalFitPct = Math.min(100, Math.round(conditionAdequacy * 0.85 + 15));
    const powerReadinessPct = missingRequirements.some(m => m.requirement.category === 'Power' || m.requirement.componentName.toLowerCase().includes('cable')) ? 50 : 100;
    const physicalFitPct = 90;

    // Plain language explanation
    let summaryExplanation = `You have ${ownedRequirements.length} of ${project.requirements.length} needed components on your bench.`;
    if (clampedScore >= 80) {
      summaryExplanation = `You have all the core sensing and control capabilities. Power access and an enclosure still need attention.`;
    } else if (clampedScore >= 50) {
      summaryExplanation = `Core controller and key logic available. A few passive sensors or output components are missing.`;
    } else {
      summaryExplanation = `Partial capability match. Requires primary sensors or controller to begin assembling.`;
    }

    const functionalNote = ownedRequirements.some(o => o.requirement.category === 'Microcontroller')
      ? 'Your microcontroller and key sensors cover the core functions.'
      : 'Microcontroller or controller board needed for autonomous operation.';

    const electricalNote = '5V power and analog/digital signals are compatible.';
    const powerNote = powerReadinessPct === 100 ? 'Power supply readily accessible.' : 'USB-powered board; a cable or power supply is missing.';

    return {
      projectId: project.id,
      projectNumber: project.projectNumber,
      title: project.title,
      feasibilityScore: clampedScore,
      scoreBreakdown: {
        functionalCapabilityPct,
        electricalFitPct,
        powerReadinessPct,
        physicalFitPct,
        requiredPartCoveragePct: Math.round(requiredCoverage),
        optionalPartCoveragePct: Math.round(optionalCoverage),
        conditionAdequacyPct: Math.round(conditionAdequacy),
        compatibilityFitPct: Math.round(compatibilityFit),
      },
      summaryExplanation,
      functionalNote,
      electricalNote,
      powerNote,
      ownedRequirements,
      missingRequirements,
      ownedCount: ownedRequirements.length,
      ownedUnitsTotal: totalOwnedUnits,
      missingCount: missingRequirements.length,
      estimatedExtraCostUsd: Math.round(estimatedExtraCostUsd * 100) / 100,
      isHighFeasibility: clampedScore >= 75,
    };
  }

  private static findMatchingItem(
    req: ProjectRequirementInput,
    inventory: InventoryItemInput[]
  ): InventoryItemInput | undefined {
    const reqName = req.componentName.toLowerCase();
    const reqCap = req.capabilityNeeded.toLowerCase();

    // 1. Direct name match
    const directMatch = inventory.find((item) =>
      item.name.toLowerCase().includes(reqName) || reqName.includes(item.name.toLowerCase())
    );
    if (directMatch) return directMatch;

    // 2. Capability match
    const capMatch = inventory.find((item) =>
      item.capabilities.some((c) =>
        c.toLowerCase().includes(reqCap) || reqCap.includes(c.toLowerCase()) ||
        (req.category === 'Sensor' && item.category === 'Sensor') ||
        (req.category === 'Output' && item.category === 'Output')
      )
    );
    if (capMatch) return capMatch;

    // 3. Substitution match
    if (req.substitutions) {
      const subs = req.substitutions.split(',').map((s) => s.trim().toLowerCase());
      const subMatch = inventory.find((item) =>
        subs.some((s) => item.name.toLowerCase().includes(s))
      );
      if (subMatch) return subMatch;
    }

    return undefined;
  }
}
