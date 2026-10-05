export interface NormalizedComponentInput {
  name: string;
  category?: string;
  partNumber?: string;
  manufacturer?: string;
  description?: string;
  quantity?: number;
  condition?: string;
  approxWeightG?: number;
}

export interface NormalizedResult {
  canonicalName: string;
  category: string;
  partNumber: string;
  manufacturer: string;
  description: string;
  approxWeightG: number;
  estimatedValueUsd: number;
  confidenceScore: number;
  capabilities: Array<{ name: string; category: string }>;
  specifications: Array<{ key: string; value: string }>;
  tags: string[];
}

// Canonical hardware knowledge base for deterministic heuristics
const KNOWN_COMPONENTS: Record<string, Partial<NormalizedResult>> = {
  'arduino uno': {
    canonicalName: 'Arduino Uno R3',
    category: 'Microcontroller',
    partNumber: 'ATmega328P',
    manufacturer: 'Arduino',
    description: 'ATmega328P · confirmed',
    approxWeightG: 25.0,
    estimatedValueUsd: 22.0,
    confidenceScore: 96,
    capabilities: [
      { name: 'Digital I/O', category: 'control' },
      { name: 'Analog input', category: 'sensing' },
      { name: 'PWM output', category: 'control' },
      { name: 'Serial communication', category: 'connection' },
      { name: '5V Power regulation', category: 'power' },
    ],
    specifications: [
      { key: 'Logic Voltage', value: '5V' },
      { key: 'Input Voltage', value: '7-12V DC via barrel jack' },
      { key: 'Microcontroller', value: 'ATmega328P @ 16MHz' },
      { key: 'Digital I/O Pins', value: '14 (6 PWM outputs)' },
      { key: 'Analog Inputs', value: '6 (10-bit ADC)' },
      { key: 'Flash Memory', value: '32 KB (0.5 KB used by bootloader)' },
    ],
    tags: ['microcontroller', 'arduino', 'atmega328p', '5v', 'beginner-friendly', 'prototyping'],
  },
  'soil moisture sensor': {
    canonicalName: 'Soil moisture sensor',
    category: 'Sensor',
    partNumber: 'Capacitive v1.2',
    manufacturer: 'Generic / Open Hardware',
    description: 'Capacitive v1.2',
    approxWeightG: 9.0,
    estimatedValueUsd: 4.5,
    confidenceScore: 94,
    capabilities: [
      { name: 'Soil moisture sensing', category: 'sensing' },
      { name: 'Analog moisture sensing', category: 'sensing' },
      { name: 'Corrosion resistant capacitive probe', category: 'sensing' },
    ],
    specifications: [
      { key: 'Operating Voltage', value: '3.3V - 5.5V DC' },
      { key: 'Output Voltage', value: '0 - 3.0V DC Analog' },
      { key: 'Interface', value: '3-Pin PH2.0 / Jumper' },
      { key: 'Probe Type', value: 'Capacitive PCB (no exposed metal corrosion)' },
    ],
    tags: ['sensor', 'soil', 'moisture', 'capacitive', 'agriculture', 'analog'],
  },
  'dht11': {
    canonicalName: 'DHT11',
    category: 'Sensor',
    partNumber: 'DHT11',
    manufacturer: 'Aosong',
    description: 'Temperature & humidity',
    approxWeightG: 3.0,
    estimatedValueUsd: 3.0,
    confidenceScore: 92,
    capabilities: [
      { name: 'Temperature sensing', category: 'sensing' },
      { name: 'Humidity sensing', category: 'sensing' },
      { name: 'Single-wire digital protocol', category: 'connection' },
    ],
    specifications: [
      { key: 'Voltage', value: '3.5V - 5.5V' },
      { key: 'Temp Range', value: '0°C to 50°C (±2°C)' },
      { key: 'Humidity Range', value: '20% to 90% RH (±5%)' },
      { key: 'Sampling Rate', value: '1 Hz (1 reading / sec)' },
    ],
    tags: ['sensor', 'temperature', 'humidity', 'weather', 'digital'],
  },
  'photoresistor': {
    canonicalName: 'Photoresistor',
    category: 'Sensor',
    partNumber: 'LDR · 5 mm',
    manufacturer: 'Generic Passive',
    description: 'LDR · 5 mm',
    approxWeightG: 1.0,
    estimatedValueUsd: 0.5,
    confidenceScore: 95,
    capabilities: [
      { name: 'Ambient light sensing', category: 'sensing' },
      { name: 'Variable resistance', category: 'sensing' },
    ],
    specifications: [
      { key: 'Max Voltage', value: '150V DC' },
      { key: 'Light Resistance', value: '10k - 20k Ohm @ 10 Lux' },
      { key: 'Dark Resistance', value: '1M - 2M Ohm' },
      { key: 'Peak Spectral', value: '540 nm' },
    ],
    tags: ['sensor', 'light', 'ldr', 'photoresistor', 'analog', 'passive'],
  },
  'leds': {
    canonicalName: 'LEDs',
    category: 'Output',
    partNumber: '2 green + 2 red · 5 mm',
    manufacturer: 'Opto-Electronics',
    description: '2 green + 2 red · 5 mm',
    approxWeightG: 4.0,
    estimatedValueUsd: 1.0,
    confidenceScore: 98,
    capabilities: [
      { name: 'Visual status indication', category: 'output' },
      { name: 'Dual color signaling (Green/Red)', category: 'output' },
    ],
    specifications: [
      { key: 'Forward Voltage', value: '2.0V - 2.2V (Red), 3.0V - 3.2V (Green)' },
      { key: 'Forward Current', value: '20 mA' },
      { key: 'Luminous Intensity', value: '300-400 mcd' },
      { key: 'Package', value: '5mm Through-hole' },
    ],
    tags: ['output', 'led', 'visual', 'indicator', 'diode'],
  },
  'jumper wires': {
    canonicalName: 'Jumper wires',
    category: 'Interface',
    partNumber: 'M-M / M-F 20cm',
    manufacturer: 'Generic Prototyping',
    description: 'Assorted 20cm jumper ribbon',
    approxWeightG: 15.0,
    estimatedValueUsd: 3.0,
    confidenceScore: 99,
    capabilities: [
      { name: 'Signal connection', category: 'connection' },
      { name: 'Power distribution', category: 'power' },
    ],
    specifications: [
      { key: 'Length', value: '20 cm' },
      { key: 'Gauge', value: '28 AWG' },
      { key: 'Connector Type', value: 'DuPont Male-to-Male / Male-to-Female' },
    ],
    tags: ['wiring', 'jumper', 'dupont', 'connection', 'prototyping'],
  },
  'breadboard': {
    canonicalName: 'Mini breadboard',
    category: 'Interface',
    partNumber: '400-Point Solderless',
    manufacturer: 'Generic Prototyping',
    description: 'Half-size transparent / white breadboard',
    approxWeightG: 32.0,
    estimatedValueUsd: 4.0,
    confidenceScore: 97,
    capabilities: [
      { name: 'Solderless prototyping', category: 'connection' },
      { name: 'Dual power rails', category: 'power' },
    ],
    specifications: [
      { key: 'Tie Points', value: '400 points (300 in terminal, 100 in power)' },
      { key: 'Pitch', value: '2.54 mm standard' },
      { key: 'Adhesive Backing', value: 'Double-sided foam tape' },
    ],
    tags: ['breadboard', 'prototyping', 'solderless', 'electronics'],
  },
  'servo': {
    canonicalName: 'SG90 Micro Servo',
    category: 'Output',
    partNumber: 'SG90 9g',
    manufacturer: 'TowerPro / Generic',
    description: '180-degree micro servo motor',
    approxWeightG: 9.0,
    estimatedValueUsd: 5.0,
    confidenceScore: 93,
    capabilities: [
      { name: 'Rotational positioning (0-180°)', category: 'output' },
      { name: 'PWM position control', category: 'control' },
    ],
    specifications: [
      { key: 'Operating Voltage', value: '4.8V - 6.0V' },
      { key: 'Torque', value: '1.8 kg-cm @ 4.8V' },
      { key: 'Speed', value: '0.1 sec / 60 degrees' },
    ],
    tags: ['actuator', 'motor', 'servo', 'sg90', 'robotics'],
  },
  'ultrasonic': {
    canonicalName: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'Sensor',
    partNumber: 'HC-SR04',
    manufacturer: 'Generic',
    description: 'Sonar distance measuring transducer',
    approxWeightG: 8.5,
    estimatedValueUsd: 4.0,
    confidenceScore: 95,
    capabilities: [
      { name: 'Distance measurement (2cm - 400cm)', category: 'sensing' },
      { name: 'Echo time-of-flight sensing', category: 'sensing' },
    ],
    specifications: [
      { key: 'Operating Voltage', value: '5V DC' },
      { key: 'Measuring Angle', value: '15 degrees' },
      { key: 'Accuracy', value: '3 mm' },
    ],
    tags: ['sensor', 'ultrasonic', 'distance', 'sonar', 'rangefinder'],
  },
};

export class ComponentNormalizer {
  public static normalize(input: NormalizedComponentInput): NormalizedResult {
    const rawLower = (input.name + ' ' + (input.description || '')).toLowerCase();

    // Check for match in knowledge base
    for (const [key, known] of Object.entries(KNOWN_COMPONENTS)) {
      if (rawLower.includes(key)) {
        return {
          canonicalName: known.canonicalName || input.name,
          category: known.category || input.category || 'Passive',
          partNumber: input.partNumber || known.partNumber || 'GENERIC',
          manufacturer: input.manufacturer || known.manufacturer || 'Standard',
          description: input.description || known.description || '',
          approxWeightG: input.approxWeightG || known.approxWeightG || 10.0,
          estimatedValueUsd: known.estimatedValueUsd || 5.0,
          confidenceScore: known.confidenceScore || 90,
          capabilities: known.capabilities || [{ name: 'General Circuitry', category: 'control' }],
          specifications: known.specifications || [{ key: 'Form Factor', value: 'Through-hole / Module' }],
          tags: known.tags || ['electronics', 'maker'],
        };
      }
    }

    // Default heuristic for unknown/general components
    const category = input.category || 'Passive';
    return {
      canonicalName: input.name,
      category,
      partNumber: input.partNumber || 'GENERIC-PART',
      manufacturer: input.manufacturer || 'Unbranded',
      description: input.description || 'Rescued electronic component',
      approxWeightG: input.approxWeightG || 12.0,
      estimatedValueUsd: 3.5,
      confidenceScore: 85,
      capabilities: [
        { name: `${category} capability`, category: 'control' },
        { name: 'General electronics interface', category: 'connection' },
      ],
      specifications: [
        { key: 'Condition State', value: input.condition || 'Used · working' },
        { key: 'Form Factor', value: 'Standard module' },
      ],
      tags: ['electronics', 'salvaged', category.toLowerCase()],
    };
  }
}
