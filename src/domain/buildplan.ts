export interface BuildStepItem {
  stepNumber: number;
  title: string;
  description: string;
  durationMinutes: number;
  safetyWarning?: string;
  milestoneCheck?: string;
  isCompleted: boolean;
  completedAt?: string | null;
}

export class BuildPlanService {
  public static calculateProgress(steps: BuildStepItem[]): {
    completedCount: number;
    totalCount: number;
    percentage: number;
    estimatedMinutesRemaining: number;
  } {
    if (steps.length === 0) {
      return { completedCount: 0, totalCount: 0, percentage: 0, estimatedMinutesRemaining: 0 };
    }

    const completedCount = steps.filter((s) => s.isCompleted).length;
    const percentage = Math.round((completedCount / steps.length) * 100);

    const remainingSteps = steps.filter((s) => !s.isCompleted);
    const estimatedMinutesRemaining = remainingSteps.reduce(
      (sum, s) => sum + (s.durationMinutes || 15),
      0
    );

    return {
      completedCount,
      totalCount: steps.length,
      percentage,
      estimatedMinutesRemaining,
    };
  }

  public static toggleStep(
    steps: BuildStepItem[],
    stepNumber: number
  ): BuildStepItem[] {
    return steps.map((step) => {
      if (step.stepNumber === stepNumber) {
        const nextCompleted = !step.isCompleted;
        return {
          ...step,
          isCompleted: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : null,
        };
      }
      return step;
    });
  }
}
