import { CandidateResult, VisionScanResult } from './scanner';
import { ComponentNormalizer } from './normalizer';
import { CapabilityResolver } from './capability';

export interface ConfirmedComponentData {
  name: string;
  categoryName: string;
  partNumber?: string;
  manufacturer?: string;
  quantity: number;
  condition: string;
  approxWeightG: number;
  location?: string;
  notes?: string;
  photoUrl: string;
  selectedCandidateRank?: number;
  confidenceScore: number;
  provenanceSource: 'scan_ai' | 'user_manual' | 'catalog';
  capabilities: Array<{ name: string; category: string; provenance: string }>;
  specifications: Array<{ key: string; value: string; provenance: string }>;
  compatibilities: Array<{ platform: string; isCompatible: boolean; notes?: string }>;
  safetyFlags: Array<{ level: string; title: string; description: string }>;
}

export class IdentificationResolver {
  public static rankCandidates(scanResult: VisionScanResult): CandidateResult[] {
    return [...scanResult.candidates].sort((a, b) => b.confidence - a.confidence);
  }

  public static resolveConfirmation(
    candidate: CandidateResult,
    userEdits?: Partial<ConfirmedComponentData>
  ): ConfirmedComponentData {
    const normalized = ComponentNormalizer.normalize({
      name: userEdits?.name || candidate.name,
      category: userEdits?.categoryName || candidate.categoryName,
      partNumber: userEdits?.partNumber || candidate.partNumber,
      manufacturer: userEdits?.manufacturer || candidate.manufacturer,
      quantity: userEdits?.quantity || 1,
      condition: userEdits?.condition || 'Used · working',
      approxWeightG: userEdits?.approxWeightG,
    });

    const derivedCapabilities = CapabilityResolver.deriveCapabilities(
      normalized.canonicalName,
      normalized.category,
      candidate.specifications
    );

    // Platform compatibilities heuristics
    const compatibilities: Array<{ platform: string; isCompatible: boolean; notes?: string }> = [];
    const nameLower = normalized.canonicalName.toLowerCase();

    if (nameLower.includes('arduino') || normalized.category === 'Microcontroller') {
      compatibilities.push({ platform: 'Arduino (5V Logic)', isCompatible: true, notes: 'Native 5V logic and headers' });
      compatibilities.push({ platform: 'ESP32 (3.3V)', isCompatible: true, notes: 'Requires logic level shifter on 5V inputs' });
      compatibilities.push({ platform: 'Raspberry Pi GPIO', isCompatible: true, notes: 'Use USB Serial interface for data exchange' });
    } else if (normalized.category === 'Sensor') {
      compatibilities.push({ platform: 'Arduino (5V ADC)', isCompatible: true, notes: 'Direct analog connect to A0-A5' });
      compatibilities.push({ platform: 'ESP32 (3.3V ADC)', isCompatible: true, notes: 'Operates on 3.3V VCC' });
    } else {
      compatibilities.push({ platform: 'Standard 5V/3.3V MCU', isCompatible: true, notes: 'Standard breadboard prototyping' });
    }

    // Safety flags heuristics
    const safetyFlags: Array<{ level: string; title: string; description: string }> = [];
    if (candidate.safetyNotes) {
      safetyFlags.push({ level: 'info', title: 'Operational Guidance', description: candidate.safetyNotes });
    }
    if (normalized.category === 'Output' || nameLower.includes('led')) {
      safetyFlags.push({ level: 'caution', title: 'Current Limiting Required', description: 'Always use in series with 220Ω - 330Ω resistor to prevent burnouts.' });
    }
    if (normalized.category === 'Actuator' || nameLower.includes('servo') || nameLower.includes('motor')) {
      safetyFlags.push({ level: 'caution', title: 'Inductive Kickback Protection', description: 'Use flyback diode or dedicated driver stage for high current spikes.' });
    }

    const isUserModified = Boolean(userEdits?.name && userEdits.name !== candidate.name);

    return {
      name: normalized.canonicalName,
      categoryName: normalized.category,
      partNumber: normalized.partNumber,
      manufacturer: normalized.manufacturer,
      quantity: userEdits?.quantity || 1,
      condition: userEdits?.condition || 'Used · working',
      approxWeightG: normalized.approxWeightG,
      location: userEdits?.location || 'Bench Drawer A',
      notes: userEdits?.notes || `Identified with ${candidate.confidence}% confidence via ${candidate.evidence}`,
      photoUrl: userEdits?.photoUrl || '/images/bench_arduino.jpg',
      selectedCandidateRank: candidate.rank,
      confidenceScore: candidate.confidence,
      provenanceSource: isUserModified ? 'user_manual' : 'scan_ai',
      capabilities: derivedCapabilities.map((c) => ({
        name: c.name,
        category: c.category,
        provenance: 'inferred',
      })),
      specifications: candidate.specifications.map((s) => ({
        key: s.key,
        value: s.value,
        provenance: 'catalog',
      })),
      compatibilities,
      safetyFlags,
    };
  }
}
