import { describe, it, expect } from 'vitest';
import { ComponentNormalizer } from '../src/domain/normalizer';
import { CapabilityResolver } from '../src/domain/capability';
import { ProjectMatcher } from '../src/domain/matcher';
import { ImpactCalculator } from '../src/domain/impact';

describe('ComponentNormalizer', () => {
  it('should normalize Arduino Uno R3 with canonical specs, capabilities, and weight', () => {
    const result = ComponentNormalizer.normalize({
      name: 'arduino uno r3',
      description: 'rescued board',
    });

    expect(result.canonicalName).toBe('Arduino Uno R3');
    expect(result.category).toBe('Microcontroller');
    expect(result.partNumber).toBe('ATmega328P');
    expect(result.approxWeightG).toBe(25.0);
    expect(result.confidenceScore).toBe(96);
    expect(result.capabilities.some((c) => c.name === 'Digital I/O')).toBe(true);
    expect(result.capabilities.some((c) => c.name === 'Analog input')).toBe(true);
  });

  it('should normalize soil moisture sensor with capacitive characteristics', () => {
    const result = ComponentNormalizer.normalize({
      name: 'Soil moisture sensor capacitive v1.2',
    });

    expect(result.canonicalName).toBe('Soil moisture sensor');
    expect(result.category).toBe('Sensor');
    expect(result.approxWeightG).toBe(9.0);
    expect(result.capabilities.some((c) => c.name.includes('moisture'))).toBe(true);
  });
});

describe('CapabilityResolver', () => {
  it('should resolve digital, analog, and serial capabilities for microcontrollers', () => {
    const caps = CapabilityResolver.deriveCapabilities('Arduino Uno R3', 'Microcontroller');
    const names = caps.map((c) => c.name);

    expect(names).toContain('Digital I/O');
    expect(names).toContain('Analog input');
    expect(names).toContain('PWM output');
    expect(names).toContain('Serial communication');
  });

  it('should resolve environmental sensing capabilities for soil and DHT sensors', () => {
    const soilCaps = CapabilityResolver.deriveCapabilities('Capacitive soil moisture sensor', 'Sensor');
    expect(soilCaps.some((c) => c.name === 'Soil moisture sensing')).toBe(true);

    const dhtCaps = CapabilityResolver.deriveCapabilities('DHT11', 'Sensor');
    expect(dhtCaps.some((c) => c.name === 'Temperature sensing')).toBe(true);
    expect(dhtCaps.some((c) => c.name === 'Humidity sensing')).toBe(true);
  });
});

describe('ProjectMatcher', () => {
  const inventory = [
    {
      id: '1',
      name: 'Arduino Uno R3',
      category: 'Microcontroller',
      quantity: 1,
      condition: 'Used · working',
      capabilities: ['Digital I/O', 'Analog input', 'PWM output', 'Analog input + digital control'],
    },
    {
      id: '2',
      name: 'Capacitive moisture sensor',
      category: 'Sensor',
      quantity: 1,
      condition: 'Used · working',
      capabilities: ['Soil moisture sensing', 'Analog moisture sensing'],
    },
    {
      id: '3',
      name: 'LEDs · green + red',
      category: 'Output',
      quantity: 4,
      condition: 'Used · working',
      capabilities: ['Visual status output', 'Visual status indication'],
    },
    {
      id: '4',
      name: 'Jumper wires',
      category: 'Interface',
      quantity: 12,
      condition: 'Used · working',
      capabilities: ['Signal / power connection', 'Solderless prototyping'],
    },
    {
      id: '5',
      name: 'Mini breadboard',
      category: 'Interface',
      quantity: 1,
      condition: 'Used · working',
      capabilities: ['Solderless prototyping'],
    },
  ];

  const project = {
    id: 'proj-014',
    projectNumber: '014',
    title: 'Smart plant monitor',
    description: 'Soil moisture monitor with LEDs',
    difficulty: 'Beginner friendly',
    estimatedHours: '2–3 hours',
    requirements: [
      { id: 'r1', componentName: 'Arduino Uno R3', capabilityNeeded: 'Analog input + digital control', category: 'Microcontroller', quantityNeeded: 1, isOptional: false, unitCostUsd: 22.0 },
      { id: 'r2', componentName: 'Capacitive moisture sensor', capabilityNeeded: 'Soil moisture sensing', category: 'Sensor', quantityNeeded: 1, isOptional: false, unitCostUsd: 4.5 },
      { id: 'r3', componentName: 'LEDs · green + red', capabilityNeeded: 'Visual status output', category: 'Output', quantityNeeded: 2, isOptional: false, unitCostUsd: 1.0 },
      { id: 'r4', componentName: 'Jumper wires', capabilityNeeded: 'Signal / power connection', category: 'Interface', quantityNeeded: 6, isOptional: false, unitCostUsd: 1.5 },
      { id: 'r5', componentName: 'Mini breadboard', capabilityNeeded: 'Solderless prototyping', category: 'Interface', quantityNeeded: 1, isOptional: false, unitCostUsd: 4.0 },
      { id: 'r6', componentName: 'USB-B Power Cable', capabilityNeeded: '5V USB power delivery', category: 'Power', quantityNeeded: 1, isOptional: true, unitCostUsd: 2.5 },
      { id: 'r7', componentName: 'Recycled Enclosure', capabilityNeeded: 'Moisture-resistant housing', category: 'Enclosure', quantityNeeded: 1, isOptional: true, unitCostUsd: 2.0 },
    ],
  };

  it('should score 86% feasible for Smart Plant Monitor with matching bench parts', () => {
    const match = ProjectMatcher.matchProject(project, inventory);

    expect(match.feasibilityScore).toBeGreaterThanOrEqual(80);
    expect(match.feasibilityScore).toBeLessThanOrEqual(95);
    expect(match.ownedCount).toBe(5);
    expect(match.missingCount).toBe(2);
    expect(match.scoreBreakdown.functionalCapabilityPct).toBe(100);
    expect(match.estimatedExtraCostUsd).toBe(4.5); // 2.5 + 2.0 for missing USB cable and enclosure
  });
});

describe('ImpactCalculator', () => {
  it('should calculate accurate metrics and diverted mass', () => {
    const items = [
      { id: '1', quantity: 1, approxWeightG: 25.0, estimatedValueUsd: 22.0, category: 'Microcontroller', condition: 'Used · working' },
      { id: '2', quantity: 1, approxWeightG: 9.0, estimatedValueUsd: 4.5, category: 'Sensor', condition: 'Used · working' },
      { id: '3', quantity: 4, approxWeightG: 1.0, estimatedValueUsd: 1.0, category: 'Output', condition: 'Used · working' },
    ];

    const impact = ImpactCalculator.calculate(items, 8);

    expect(impact.totalItemsCount).toBe(6);
    expect(impact.totalUniqueTypesCount).toBe(3);
    expect(impact.totalInventoryMassG).toBe(38); // 25 + 9 + 4
    expect(impact.reusedMassKg).toBe(0.18);
    expect(impact.partsReusedCount).toBe(6);
    expect(impact.estimatedTotalValueUsd).toBe(30.5); // 22 + 4.5 + 4*1
  });
});

describe('MockVisionProvider', () => {
  it('should identify paper documents and non-electronic items with 0% confidence', async () => {
    const { MockVisionProvider } = await import('../src/domain/scanner');
    const provider = new MockVisionProvider();

    const result = await provider.analyze({
      primaryPhotoUrl: '/uploads/sample-paper.jpg',
      filename: 'WhatsApp Image 2026-09-04 at 4.43.05 PM.jpeg',
    });

    expect(result.highestConfidence).toBe(0);
    expect(result.candidates[0].name).toContain('Non-electronic');
    expect(result.candidates[0].confidence).toBe(0);
  });
});
