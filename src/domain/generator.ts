import { InventoryItemInput } from './matcher';

export interface ProjectGenerationInput {
  goalText: string;
  skillLevel: 'Beginner friendly' | 'Intermediate' | 'Advanced';
  intendedUse: 'Environment & Plants' | 'Home Automation' | 'Robotics & Actuation' | 'Lighting & Energy' | 'Education & Art';
  availableTime: '1–2 hours' | '2–3 hours' | '3–5 hours' | 'Weekend build';
  maxBudgetUsd: number;
  constraints: string[]; // e.g. ["no_soldering", "classroom_friendly", "max_inventory_reuse"]
  refinementType?: 'simpler' | 'lower_budget' | 'no_soldering' | 'use_more_inventory' | 'classroom_friendly';
}

export interface GeneratedConcept {
  id: string;
  title: string;
  tagline: string;
  oneSentenceValue: string;
  difficulty: string;
  estimatedTime: string;
  estimatedExtraCost: number;
  estimatedReuseValue: number;
  feasibilityScore: number;
  flowStages: string;
  assumptions: string;
  safetyNotes: string;
  reusedParts: string[];
  missingParts: string[];
  refinementDiffNote?: string;
}

export interface ProjectGenerationResultPayload {
  concepts: GeneratedConcept[];
  summaryNote: string;
  provider: string;
}

export class ProjectGenerationService {
  public static generateConcepts(
    input: ProjectGenerationInput,
    inventory: InventoryItemInput[]
  ): ProjectGenerationResultPayload {
    const hasMicrocontroller = inventory.some((i) => i.category === 'Microcontroller' || i.name.toLowerCase().includes('arduino'));
    const hasMoisture = inventory.some((i) => i.name.toLowerCase().includes('moisture') || i.name.toLowerCase().includes('soil'));
    const hasLight = inventory.some((i) => i.name.toLowerCase().includes('photoresistor') || i.name.toLowerCase().includes('light'));
    const hasServo = inventory.some((i) => i.name.toLowerCase().includes('servo'));
    const hasUltrasonic = inventory.some((i) => i.name.toLowerCase().includes('ultrasonic'));
    const hasLeds = inventory.some((i) => i.name.toLowerCase().includes('led'));

    const concepts: GeneratedConcept[] = [];

    // Concept 1: Primary match based on goal & domain
    if (input.intendedUse === 'Environment & Plants' || hasMoisture) {
      concepts.push({
        id: 'gen-plant-monitor',
        title: 'Smart plant hydration coach',
        tagline: 'Dual-LED soil moisture alert system with zero soldering.',
        oneSentenceValue: 'Prevents root rot and underwatering by polling capacitive soil moisture every 2 seconds.',
        difficulty: input.refinementType === 'simpler' ? 'Beginner (Breadboard only)' : input.skillLevel,
        estimatedTime: input.refinementType === 'simpler' ? '1 hour' : '2 hours',
        estimatedExtraCost: input.refinementType === 'lower_budget' ? 0.0 : 4.5,
        estimatedReuseValue: 31.0,
        feasibilityScore: hasMicrocontroller && hasMoisture ? 94 : 75,
        flowStages: 'SAMPLE SOIL -> COMPARE THRESHOLD -> LED GLOW',
        assumptions: 'Assumes standard 5V USB power delivery and breadboard wiring.',
        safetyNotes: 'Educational 5V project. Do not submerge the probe upper connector in water.',
        reusedParts: ['Arduino Uno R3', 'Capacitive moisture sensor', 'LEDs', 'Jumper wires', 'Mini breadboard'],
        missingParts: input.refinementType === 'lower_budget' ? [] : ['USB-B Power Cable', 'Recycled enclosure'],
        refinementDiffNote: input.refinementType === 'simpler'
          ? 'Simplified from multi-state thresholds to single dry/wet LED status.'
          : input.refinementType === 'no_soldering'
          ? 'Configured 100% with solderless DuPont jumper connections.'
          : undefined,
      });
    }

    // Concept 2: Ambient or Automation
    if (input.intendedUse === 'Lighting & Energy' || hasLight || concepts.length < 2) {
      concepts.push({
        id: 'gen-adaptive-light',
        title: 'Dynamic workbench illuminator',
        tagline: 'Ambient light responsive LED bar for dusk and night soldering.',
        oneSentenceValue: 'Automates LED brightness based on daylight levels, reducing eye strain and energy use.',
        difficulty: 'Beginner friendly',
        estimatedTime: '1–2 hours',
        estimatedExtraCost: 1.5,
        estimatedReuseValue: 27.5,
        feasibilityScore: hasMicrocontroller && hasLight && hasLeds ? 92 : 70,
        flowStages: 'SENSE LUX -> CALCULATE PWM -> DIM LEDS',
        assumptions: 'Uses 10k resistor in voltage divider with photoresistor on Pin A1.',
        safetyNotes: 'Series 220Ω resistor mandatory on LED anodes.',
        reusedParts: ['Arduino Uno R3', 'Photoresistor', 'LEDs', 'Jumper wires', 'Mini breadboard'],
        missingParts: ['10k Ohm Resistor'],
        refinementDiffNote: input.refinementType === 'use_more_inventory'
          ? 'Integrated 4 dual-color LEDs instead of single indicator to utilize excess bin parts.'
          : undefined,
      });
    }

    // Concept 3: Robotics / Proximity
    if (input.intendedUse === 'Robotics & Actuation' || hasUltrasonic || hasServo || concepts.length < 3) {
      concepts.push({
        id: 'gen-radar-sonar',
        title: 'Sonar distance obstacle alert',
        tagline: 'Acoustic rangefinder with proximity buzzer tones.',
        oneSentenceValue: 'Translates target distances into progressive audio alerts, great for lab obstacle avoidance.',
        difficulty: 'Intermediate',
        estimatedTime: '2–3 hours',
        estimatedExtraCost: 2.0,
        estimatedReuseValue: 34.0,
        feasibilityScore: hasMicrocontroller && hasUltrasonic ? 88 : 65,
        flowStages: 'ULTRASONIC PING -> COMPUTE CM -> PULSE BUZZER',
        assumptions: 'Speed of sound calculated at 343 m/s @ 20°C room temperature.',
        safetyNotes: 'Ensure 5V logic line does not short against GND.',
        reusedParts: ['Arduino Uno R3', 'HC-SR04 Ultrasonic Sensor', 'Active Piezo Buzzer', 'Jumper wires'],
        missingParts: ['Mounting bracket'],
        refinementDiffNote: input.refinementType === 'classroom_friendly'
          ? 'Includes step-by-step physics worksheets on sound waves and time-of-flight math.'
          : undefined,
      });
    }

    return {
      concepts,
      summaryNote: `Generated ${concepts.length} inventory-adapted project concepts using ${inventory.length} active parts on your bench.`,
      provider: 'deterministic-heuristic-generator-v2',
    };
  }
}
