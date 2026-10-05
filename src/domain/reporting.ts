export class ReportExportService {
  /**
   * Sanitizes a cell string against CSV formula injection vulnerabilities
   */
  public static sanitizeCell(value: any): string {
    if (value === null || value === undefined) return '""';
    let str = String(value).trim();
    // Neutralize dangerous spreadsheet formula execution prefixes
    if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
      str = `'${str}`;
    }
    // Escape internal double quotes
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }

  public static generateInventoryCsv(
    components: Array<{
      name: string;
      category: string;
      quantity: number;
      condition: string;
      approxWeightG: number;
      estimatedValueUsd: number;
      location: string;
    }>
  ): string {
    const headers = ['Component Name', 'Category', 'Quantity', 'Condition', 'Est Weight (g)', 'Est Value (USD)', 'Location'];
    const rows = components.map((c) => [
      this.sanitizeCell(c.name),
      this.sanitizeCell(c.category),
      this.sanitizeCell(c.quantity),
      this.sanitizeCell(c.condition),
      this.sanitizeCell(c.approxWeightG),
      this.sanitizeCell(c.estimatedValueUsd.toFixed(2)),
      this.sanitizeCell(c.location),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public static generateImpactCsv(
    events: Array<{
      date: string;
      eventType: string;
      units: number;
      massGrams: number;
      costAvoidedUsd: number;
      co2AvoidedKg: number;
    }>
  ): string {
    const headers = ['Date', 'Event Type', 'Units Reused', 'Mass Diverted (g)', 'Cost Avoided (USD)', 'CO2e Avoided (kg)'];
    const rows = events.map((e) => [
      this.sanitizeCell(e.date),
      this.sanitizeCell(e.eventType),
      this.sanitizeCell(e.units),
      this.sanitizeCell(e.massGrams),
      this.sanitizeCell(e.costAvoidedUsd.toFixed(2)),
      this.sanitizeCell(e.co2AvoidedKg.toFixed(2)),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
