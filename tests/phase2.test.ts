import { describe, it, expect } from 'vitest';
import { ScanOrchestrator, MockVisionProvider, SCAN_FIXTURES } from '../src/domain/scanner';
import { IdentificationResolver } from '../src/domain/identification';
import { ProjectGenerationService } from '../src/domain/generator';
import { BuildPlanService } from '../src/domain/buildplan';

describe('ScanOrchestrator & Vision Providers', () => {
  it('should validate media type and file size limits', () => {
    const orchestrator = new ScanOrchestrator();

    const invalidType = orchestrator.validateMedia({
      primaryPhotoUrl: '/test.gif',
      mimeType: 'image/gif',
    });
    expect(invalidType.isValid).toBe(false);
    expect(invalidType.error).toContain('Unsupported format');

    const oversized = orchestrator.validateMedia({
      primaryPhotoUrl: '/large.jpg',
      fileSizeBytes: 15 * 1024 * 1024,
      mimeType: 'image/jpeg',
    });
    expect(oversized.isValid).toBe(false);
    expect(oversized.error).toContain('10 MB');

    const valid = orchestrator.validateMedia({
      primaryPhotoUrl: '/bench_arduino.jpg',
      fileSizeBytes: 2 * 1024 * 1024,
      mimeType: 'image/jpeg',
    });
    expect(valid.isValid).toBe(true);
  });

  it('should analyze Arduino scan and return ranked multi-candidate results with evidence', async () => {
    const orchestrator = new ScanOrchestrator();
    const result = await orchestrator.runScan({
      primaryPhotoUrl: '/bench_arduino.jpg',
      filename: 'bench_arduino.jpg',
    });

    expect(result.highestConfidence).toBe(96);
    expect(result.candidates.length).toBeGreaterThanOrEqual(2);
    expect(result.candidates[0].name).toBe('Arduino Uno R3');
    expect(result.candidates[0].confidence).toBe(96);
    expect(result.candidates[0].evidence).toContain('PCB outline match');
  });

  it('should handle ambiguous unidentified IC scan gracefully with realistic confidence (<50%)', async () => {
    const orchestrator = new ScanOrchestrator();
    const result = await orchestrator.runScan({
      primaryPhotoUrl: '/chip_unknown.jpg',
      filename: 'ic_chip_unknown.jpg',
    });

    expect(result.highestConfidence).toBeLessThan(50);
    expect(result.candidates.length).toBe(2);
    expect(result.candidates[0].name).toBe('NE555 Precision Timer IC');
  });
});

describe('IdentificationResolver', () => {
  it('should resolve confirmation with platform compatibility and safety cautions', () => {
    const candidate = SCAN_FIXTURES.arduino.candidates[0];
    const resolved = IdentificationResolver.resolveConfirmation(candidate);

    expect(resolved.name).toBe('Arduino Uno R3');
    expect(resolved.categoryName).toBe('Microcontroller');
    expect(resolved.confidenceScore).toBe(96);
    expect(resolved.provenanceSource).toBe('scan_ai');
    expect(resolved.compatibilities.some((c) => c.platform.includes('Arduino (5V'))).toBe(true);
    expect(resolved.capabilities.some((c) => c.name === 'Digital I/O')).toBe(true);
  });
});

describe('ProjectGenerationService', () => {
  const inventory = [
    { id: '1', name: 'Arduino Uno R3', category: 'Microcontroller', quantity: 1, condition: 'Used · working', capabilities: ['Digital I/O', 'Analog input'] },
    { id: '2', name: 'Capacitive moisture sensor', category: 'Sensor', quantity: 1, condition: 'Used · working', capabilities: ['Soil moisture sensing'] },
    { id: '3', name: 'LEDs', category: 'Output', quantity: 4, condition: 'Used · working', capabilities: ['Visual status indication'] },
    { id: '4', name: 'Jumper wires', category: 'Interface', quantity: 12, condition: 'Used · working', capabilities: ['Signal connection'] },
    { id: '5', name: 'Mini breadboard', category: 'Interface', quantity: 1, condition: 'Used · working', capabilities: ['Solderless prototyping'] },
  ];

  it('should generate bounded project concepts matching user goal and inventory', () => {
    const result = ProjectGenerationService.generateConcepts(
      {
        goalText: 'Water my desk plants automatically',
        skillLevel: 'Beginner friendly',
        intendedUse: 'Environment & Plants',
        availableTime: '2–3 hours',
        maxBudgetUsd: 10,
        constraints: ['no_soldering'],
      },
      inventory
    );

    expect(result.concepts.length).toBeGreaterThanOrEqual(2);
    expect(result.concepts[0].feasibilityScore).toBeGreaterThanOrEqual(85);
    expect(result.concepts[0].reusedParts).toContain('Arduino Uno R3');
    expect(result.concepts[0].reusedParts).toContain('Capacitive moisture sensor');
  });

  it('should handle refinements like "simpler" and "lower_budget" with explicit diff notes', () => {
    const refined = ProjectGenerationService.generateConcepts(
      {
        goalText: 'Water plants',
        skillLevel: 'Beginner friendly',
        intendedUse: 'Environment & Plants',
        availableTime: '1–2 hours',
        maxBudgetUsd: 5,
        constraints: ['no_soldering'],
        refinementType: 'simpler',
      },
      inventory
    );

    expect(refined.concepts[0].refinementDiffNote).toBeDefined();
    expect(refined.concepts[0].refinementDiffNote).toContain('Simplified');
  });
});

describe('BuildPlanService', () => {
  const steps = [
    { stepNumber: 1, title: 'Clean probe', description: 'Wipe traces', durationMinutes: 10, isCompleted: true },
    { stepNumber: 2, title: 'Breadboard wiring', description: 'Place LEDs', durationMinutes: 20, isCompleted: false },
    { stepNumber: 3, title: 'Upload firmware', description: 'Flash code', durationMinutes: 15, isCompleted: false },
  ];

  it('should calculate accurate progress percentage and remaining duration', () => {
    const progress = BuildPlanService.calculateProgress(steps);

    expect(progress.completedCount).toBe(1);
    expect(progress.totalCount).toBe(3);
    expect(progress.percentage).toBe(33);
    expect(progress.estimatedMinutesRemaining).toBe(35); // 20 + 15
  });

  it('should toggle step completion correctly', () => {
    const toggled = BuildPlanService.toggleStep(steps, 2);
    expect(toggled[1].isCompleted).toBe(true);
    expect(toggled[1].completedAt).toBeDefined();

    const untoggled = BuildPlanService.toggleStep(toggled, 2);
    expect(untoggled[1].isCompleted).toBe(false);
  });
});
