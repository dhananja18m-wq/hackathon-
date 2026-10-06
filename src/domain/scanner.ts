export interface VisionScanRequest {
  primaryPhotoUrl: string;
  labelPhotoUrl?: string;
  pinPhotoUrl?: string;
  filename?: string;
  fileSizeBytes?: number;
  mimeType?: string;
}

export interface CandidateResult {
  rank: number;
  name: string;
  categoryName: string;
  partNumber?: string;
  manufacturer?: string;
  confidence: number; // 0-100
  evidence: string;
  whyExplanation: string;
  capabilities: string[];
  specifications: Array<{ key: string; value: string }>;
  safetyNotes?: string;
}

export interface VisionScanResult {
  providerName: string;
  modelVersion: string;
  highestConfidence: number;
  summaryText: string;
  evidenceSummary: string;
  candidates: CandidateResult[];
}

export interface VisionAnalysisProvider {
  analyze(request: VisionScanRequest): Promise<VisionScanResult>;
}

// Deterministic mock fixtures for development, demo, and offline testing
export const SCAN_FIXTURES: Record<string, VisionScanResult> = {
  arduino: {
    providerName: 'deterministic-demo-vision',
    modelVersion: 'v2.1-heuristic',
    highestConfidence: 96,
    summaryText: 'ATmega328P based microcontroller development board with 14 digital I/O pins and 6 analog inputs.',
    evidenceSummary: 'Visual PCB outline match, silk-screened ARDUINO UNO branding, DIP-28 socketed ATmega328P chip.',
    candidates: [
      {
        rank: 1,
        name: 'Arduino Uno R3',
        categoryName: 'Microcontroller board',
        partNumber: 'ATmega328P',
        manufacturer: 'Arduino LLC',
        confidence: 96,
        evidence: 'Visual PCB outline match, silk-screened ARDUINO UNO branding, DIP-28 socketed ATmega328P chip.',
        whyExplanation: 'Matches Arduino Uno Rev 3 reference layout: 16MHz crystal oscillator, USB-B jack, 5V regulator, and standard 2.54mm headers.',
        capabilities: ['Digital I/O', 'Analog sensing', 'PWM output', 'Serial communication', '5V Power regulation'],
        specifications: [
          { key: 'Logic Voltage', value: '5V' },
          { key: 'Microcontroller', value: 'ATmega328P @ 16MHz' },
          { key: 'Digital I/O Pins', value: '14 (6 PWM outputs)' },
          { key: 'Analog Inputs', value: '6 (10-bit ADC)' },
        ],
        safetyNotes: 'Input voltage on VIN should remain between 7V and 12V DC.',
      },
      {
        rank: 2,
        name: 'Arduino Uno SMD Edition',
        categoryName: 'Microcontroller board',
        partNumber: 'ATmega328P-AU',
        manufacturer: 'Arduino LLC',
        confidence: 78,
        evidence: 'Identical form factor and pin layout, but reference image features DIP-28 socket rather than surface-mount TQFP.',
        whyExplanation: 'Secondary candidate if surface-mount variant was used in custom batch.',
        capabilities: ['Digital I/O', 'Analog sensing', 'PWM output'],
        specifications: [
          { key: 'Logic Voltage', value: '5V' },
          { key: 'Package', value: '32-lead TQFP' },
        ],
      },
      {
        rank: 3,
        name: 'Elegoo / Funduino Uno Clone',
        categoryName: 'Microcontroller board',
        partNumber: 'CH340G / ATmega328P',
        manufacturer: 'Elegoo',
        confidence: 65,
        evidence: 'Open-source PCB clone sharing identical physical pinout and dimensions.',
        whyExplanation: 'May require CH340 USB drivers on older host machines.',
        capabilities: ['Digital I/O', 'Analog sensing', 'PWM output'],
        specifications: [
          { key: 'USB UART Chip', value: 'CH340G' },
        ],
      },
    ],
  },
  soil: {
    providerName: 'deterministic-demo-vision',
    modelVersion: 'v2.1-heuristic',
    highestConfidence: 94,
    summaryText: 'Capacitive analog soil moisture sensor probe with onboard NE555 timer circuitry.',
    evidenceSummary: 'Distinctive dual-trace PCB capacitive fork with PH2.0 3-pin header.',
    candidates: [
      {
        rank: 1,
        name: 'Soil moisture sensor',
        categoryName: 'Sensor',
        partNumber: 'Capacitive v1.2',
        manufacturer: 'Generic / Open Source',
        confidence: 94,
        evidence: 'Capacitive fork geometry, no exposed copper pads (corrosion resistant).',
        whyExplanation: 'Operates between 3.3V and 5.5V, outputting 0-3V analog DC voltage proportional to moisture.',
        capabilities: ['Soil moisture sensing', 'Analog moisture sensing', 'Corrosion-resistant probe'],
        specifications: [
          { key: 'Operating Voltage', value: '3.3V - 5.5V DC' },
          { key: 'Output', value: '0 - 3.0V Analog' },
        ],
        safetyNotes: 'Do not submerge the top electronics connector into water or wet soil.',
      },
    ],
  },
  ambiguous: {
    providerName: 'deterministic-demo-vision',
    modelVersion: 'v2.1-heuristic',
    highestConfidence: 45,
    summaryText: 'Unidentified 8-pin DIP integrated circuit. Printed part number is partially obscured.',
    evidenceSummary: 'Standard 8-pin DIP package with notched index pin 1.',
    candidates: [
      {
        rank: 1,
        name: 'NE555 Precision Timer IC',
        categoryName: 'Passive',
        partNumber: 'NE555P',
        manufacturer: 'Texas Instruments / Generic',
        confidence: 48,
        evidence: '8-pin DIP footprint, common in salvaged timing circuits.',
        whyExplanation: 'Widely used astable / monostable multivibrator timer chip.',
        capabilities: ['Pulse generation', 'Astable timing oscillation', 'PWM generation'],
        specifications: [
          { key: 'Supply Voltage', value: '4.5V - 16V' },
          { key: 'Package', value: 'DIP-8' },
        ],
      },
      {
        rank: 2,
        name: 'LM358 Dual Operational Amplifier',
        categoryName: 'Passive',
        partNumber: 'LM358N',
        manufacturer: 'National / TI',
        confidence: 42,
        evidence: 'Identical 8-pin DIP footprint, common in analog signal conditioning.',
        whyExplanation: 'Dual op-amp IC used in sensor amplification.',
        capabilities: ['Analog signal amplification', 'Voltage comparator'],
        specifications: [
          { key: 'Supply Voltage', value: '3V - 32V' },
          { key: 'Package', value: 'DIP-8' },
        ],
      },
    ],
  },
  non_electronic: {
    providerName: 'deterministic-demo-vision',
    modelVersion: 'v2.1-heuristic',
    highestConfidence: 0,
    summaryText: 'No electronic hardware, printed circuit board, or semiconductor leads were recognized in this image.',
    evidenceSummary: 'Visual analysis indicates a paper document, printed sheet, or non-electronic household object. No PCB substrate, solder pads, or electronic IC packages identified.',
    candidates: [
      {
        rank: 1,
        name: 'Non-electronic item (Document / Paper)',
        categoryName: 'Unclassified / Non-electronic',
        confidence: 0,
        evidence: 'High luminance planar surface with printed text. Absence of copper traces, silicon packaging, or component leads.',
        whyExplanation: 'Image does not match any known microcontroller, sensor, passive, or electro-mechanical component catalog entry.',
        capabilities: [],
        specifications: [
          { key: 'Detected Type', value: 'Paper / Printed Sheet' },
          { key: 'Electronics Status', value: 'Non-electronic item' },
        ],
        safetyNotes: 'Paper and non-conductive materials are not suitable for electrical projects.',
      },
    ],
  },
};

export class MockVisionProvider implements VisionAnalysisProvider {
  async analyze(request: VisionScanRequest): Promise<VisionScanResult> {
    const raw = (request.filename || request.primaryPhotoUrl || '').toLowerCase();

    if (raw.includes('soil') || raw.includes('moisture') || raw.includes('probe')) {
      return SCAN_FIXTURES.soil;
    }
    if (raw.includes('ic') || raw.includes('ambiguous') || raw.includes('unknown') || raw.includes('chip')) {
      return SCAN_FIXTURES.ambiguous;
    }
    if (
      raw.includes('paper') ||
      raw.includes('doc') ||
      raw.includes('exam') ||
      raw.includes('sheet') ||
      raw.includes('page') ||
      raw.includes('text') ||
      raw.includes('saveetha') ||
      raw.includes('whatsapp') ||
      raw.includes('nonelectronic') ||
      raw.includes('non_electronic')
    ) {
      return SCAN_FIXTURES.non_electronic;
    }
    // Default to Arduino Uno R3 fixture
    return SCAN_FIXTURES.arduino;
  }
}

export class ScanOrchestrator {
  private provider: VisionAnalysisProvider;

  constructor(provider?: VisionAnalysisProvider) {
    this.provider = provider || new MockVisionProvider();
  }

  public validateMedia(request: VisionScanRequest): { isValid: boolean; error?: string } {
    if (!request.primaryPhotoUrl) {
      return { isValid: false, error: 'Primary component photo is required.' };
    }

    if (request.fileSizeBytes && request.fileSizeBytes > 10 * 1024 * 1024) {
      return { isValid: false, error: 'File size exceeds 10 MB limit. Please compress the image.' };
    }

    if (request.mimeType && !['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(request.mimeType.toLowerCase())) {
      return { isValid: false, error: 'Unsupported format. Please upload JPG, PNG, or WebP images.' };
    }

    return { isValid: true };
  }

  public async runScan(request: VisionScanRequest): Promise<VisionScanResult> {
    const validation = this.validateMedia(request);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    return await this.provider.analyze(request);
  }
}
