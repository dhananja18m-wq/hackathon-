export interface InventoryMetricInput {
  id: string;
  quantity: number;
  approxWeightG: number;
  estimatedValueUsd: number;
  category: string;
  condition: string;
}

export interface ImpactSummary {
  totalItemsCount: number;
  totalUniqueTypesCount: number;
  totalCapabilitiesCount: number;
  totalInventoryMassG: number;
  totalInventoryMassKg: number;
  reusedMassKg: number;              // e.g. 0.18 kg from completed demo builds
  partsReusedCount: number;          // e.g. 6 in completed builds
  completedBuildsCount: number;      // e.g. 2
  estimatedTotalValueUsd: number;    // Estimated value of on-bench inventory
  estimatedAvoidedCostUsd: number;   // Avoided new hardware purchase cost
  estimatedCo2AvoidedKg: number;     // Avoided manufacturing emissions (approx 1.8 kg CO2e / 100g e-waste)
}

export class ImpactCalculator {
  // Documented sustainability constants & assumptions
  public static readonly ASSUMPTIONS = {
    CO2_KG_PER_KG_EWASTE: 18.0,       // Estimated embodied carbon in mixed microelectronics manufacturing
    COMPLETED_DEMO_REUSED_UNITS: 6,   // Seed baseline for demo builds
    COMPLETED_DEMO_MASS_KG: 0.18,     // Seed baseline for demo builds (180 grams)
    COMPLETED_DEMO_BUILDS_COUNT: 2,
    DEFAULT_UNIT_WEIGHT_G: 10.0,
    DEFAULT_UNIT_VALUE_USD: 4.5,
  };

  public static calculate(
    items: InventoryMetricInput[],
    uniqueCapabilitiesCount: number = 11
  ): ImpactSummary {
    const totalItemsCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const totalUniqueTypesCount = items.length;

    const totalInventoryMassG = items.reduce(
      (acc, item) => acc + (item.approxWeightG || this.ASSUMPTIONS.DEFAULT_UNIT_WEIGHT_G) * (item.quantity || 1),
      0
    );

    const totalInventoryMassKg = Math.round((totalInventoryMassG / 1000) * 100) / 100;

    const estimatedTotalValueUsd = items.reduce(
      (acc, item) => acc + (item.estimatedValueUsd || this.ASSUMPTIONS.DEFAULT_UNIT_VALUE_USD) * (item.quantity || 1),
      0
    );

    // Cost avoided by reusing existing parts rather than buying new prototyping kits
    const estimatedAvoidedCostUsd = Math.round(estimatedTotalValueUsd * 1.25 * 100) / 100;

    // Environmental calculation: Total mass (inventory + reused) * embodied carbon factor
    const combinedMassKg = totalInventoryMassKg + this.ASSUMPTIONS.COMPLETED_DEMO_MASS_KG;
    const estimatedCo2AvoidedKg = Math.round(combinedMassKg * this.ASSUMPTIONS.CO2_KG_PER_KG_EWASTE * 10) / 10;

    return {
      totalItemsCount,
      totalUniqueTypesCount,
      totalCapabilitiesCount: uniqueCapabilitiesCount,
      totalInventoryMassG: Math.round(totalInventoryMassG),
      totalInventoryMassKg,
      reusedMassKg: this.ASSUMPTIONS.COMPLETED_DEMO_MASS_KG,
      partsReusedCount: this.ASSUMPTIONS.COMPLETED_DEMO_REUSED_UNITS,
      completedBuildsCount: this.ASSUMPTIONS.COMPLETED_DEMO_BUILDS_COUNT,
      estimatedTotalValueUsd: Math.round(estimatedTotalValueUsd * 100) / 100,
      estimatedAvoidedCostUsd,
      estimatedCo2AvoidedKg,
    };
  }
}
