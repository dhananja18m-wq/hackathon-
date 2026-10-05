export interface ResolvedCapability {
  name: string;
  category: 'sensing' | 'control' | 'output' | 'connection' | 'power';
  description: string;
}

export class CapabilityResolver {
  public static deriveCapabilities(
    componentName: string,
    category: string,
    specs: Array<{ key: string; value: string }> = []
  ): ResolvedCapability[] {
    const nameLower = componentName.toLowerCase();
    const caps: ResolvedCapability[] = [];

    // Microcontrollers
    if (category.toLowerCase().includes('microcontroller') || nameLower.includes('arduino') || nameLower.includes('esp32') || nameLower.includes('pico')) {
      caps.push({ name: 'Digital I/O', category: 'control', description: 'Read and write high/low digital logic states' });
      caps.push({ name: 'Analog input', category: 'sensing', description: 'Measure variable analog voltage levels via ADC' });
      caps.push({ name: 'PWM output', category: 'control', description: 'Pulse-width modulated output for analog-like fading and motor control' });
      caps.push({ name: 'Serial communication', category: 'connection', description: 'UART / USB interface to computer or peripherals' });
    }

    // Moisture / Soil
    if (nameLower.includes('soil') || nameLower.includes('moisture')) {
      caps.push({ name: 'Soil moisture sensing', category: 'sensing', description: 'Measure relative moisture levels in earth and potting mixes' });
      caps.push({ name: 'Analog moisture sensing', category: 'sensing', description: 'Outputs analog DC voltage proportional to water content' });
    }

    // Temperature & Humidity
    if (nameLower.includes('dht') || nameLower.includes('temperature') || nameLower.includes('humidity')) {
      caps.push({ name: 'Temperature sensing', category: 'sensing', description: 'Accurate ambient temperature reading' });
      caps.push({ name: 'Humidity sensing', category: 'sensing', description: 'Relative air humidity measurement' });
    }

    // Light
    if (nameLower.includes('photoresistor') || nameLower.includes('ldr') || nameLower.includes('light')) {
      caps.push({ name: 'Ambient light sensing', category: 'sensing', description: 'Variable resistance responding to ambient illumination' });
    }

    // LEDs & Displays
    if (nameLower.includes('led') || category.toLowerCase().includes('output')) {
      caps.push({ name: 'Visual status indication', category: 'output', description: 'Emit colored visible light for user cues' });
    }

    // Distance / Ultrasonic
    if (nameLower.includes('ultrasonic') || nameLower.includes('distance') || nameLower.includes('sonar')) {
      caps.push({ name: 'Distance measurement', category: 'sensing', description: 'Calculate distance from acoustic pulse reflection' });
    }

    // Servos / Motors
    if (nameLower.includes('servo') || nameLower.includes('motor')) {
      caps.push({ name: 'Mechanical actuation', category: 'output', description: 'Precision angular or rotational movement' });
    }

    // Connections / Breadboards
    if (nameLower.includes('wire') || nameLower.includes('jumper') || nameLower.includes('breadboard')) {
      caps.push({ name: 'Solderless prototyping', category: 'connection', description: 'Quick breadboard interconnects without soldering' });
      caps.push({ name: 'Signal & power routing', category: 'connection', description: 'Distribute DC power rails and digital/analog lines' });
    }

    // Fallback if empty
    if (caps.length === 0) {
      caps.push({ name: `${category} control`, category: 'control', description: 'Standard component interface' });
    }

    return caps;
  }
}
