import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Phase 3 comprehensive database seed...');

  // 1. Create Default User & Workspace
  const user = await prisma.user.upsert({
    where: { email: 'alex@makerbench.io' },
    update: {},
    create: {
      email: 'alex@makerbench.io',
      name: 'Alex Kim',
      role: 'Student / Maker',
      experienceLevel: 'Intermediate',
      primaryGoal: 'Upcycling electronic waste into interactive IoT gadgets',
    },
  });

  const educatorUser = await prisma.user.upsert({
    where: { email: 'dr.chen@mit.edu' },
    update: {},
    create: {
      email: 'dr.chen@mit.edu',
      name: 'Dr. Sarah Chen',
      role: 'Educator / Lab Director',
      experienceLevel: 'Advanced',
      primaryGoal: 'Managing university e-waste salvage bins and student IoT kits',
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: 'alexs-maker-bench' },
    update: {},
    create: {
      name: "Alex's maker bench",
      slug: 'alexs-maker-bench',
      type: 'personal',
      description: 'Personal maker workbench for IoT prototypes, circuit salvage, and upcycling.',
    },
  });

  const labWorkspace = await prisma.workspace.upsert({
    where: { slug: 'ece-hardware-lab' },
    update: {},
    create: {
      name: 'ECE Hardware Lab & Maker Hub',
      slug: 'ece-hardware-lab',
      type: 'educational',
      description: 'Departmental electronics salvage hub and student prototyping lab.',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'owner',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: labWorkspace.id,
        userId: educatorUser.id,
      },
    },
    update: {},
    create: {
      workspaceId: labWorkspace.id,
      userId: educatorUser.id,
      role: 'owner',
    },
  });

  // 2. Categories
  const categoriesData = [
    { name: 'Microcontroller', slug: 'microcontroller', description: 'Development boards, compute modules and SoC systems', iconName: 'cpu' },
    { name: 'Sensor', slug: 'sensor', description: 'Environmental, mechanical, optical and biological transducers', iconName: 'activity' },
    { name: 'Output', slug: 'output', description: 'Visual indicators, displays, buzzers and audio transducers', iconName: 'lightbulb' },
    { name: 'Actuator', slug: 'actuator', description: 'Motors, servos, solenoids and mechanical drivers', iconName: 'cog' },
    { name: 'Interface', slug: 'interface', description: 'Breadboards, headers, jumper wires and connectors', iconName: 'git-branch' },
    { name: 'Power', slug: 'power', description: 'Batteries, buck converters, voltage regulators and USB modules', iconName: 'zap' },
    { name: 'Passive', slug: 'passive', description: 'Resistors, capacitors, inductors and switches', iconName: 'box' },
    { name: 'Enclosure', slug: 'enclosure', description: 'Housings, brackets, mounts and recycled casings', iconName: 'shield' },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.componentCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categoryMap[cat.name] = created.id;
  }

  // Clear existing items for clean idempotent seed
  await prisma.component.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.project.deleteMany({});
  await prisma.projectWorkspace.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.communityPublication.deleteMany({});
  await prisma.impactEvent.deleteMany({});

  // 3. Components
  const componentsToSeed = [
    {
      name: 'Arduino Uno R3',
      categoryId: categoryMap['Microcontroller'],
      partNumber: 'ATmega328P',
      manufacturer: 'Arduino LLC',
      description: 'ATmega328P · confirmed',
      quantity: 1,
      condition: 'Used · working',
      approxWeightG: 25.0,
      estimatedValueUsd: 22.0,
      confidenceScore: 96,
      photoUrl: 'https://images.pexels.com/photos/35652454/pexels-photo-35652454/free-photo-of-arduino-circuit-board-with-tools-on-workbench.jpeg?auto=compress&cs=tinysrgb&w=1200',
      location: 'Top Shelf Box A',
      source: 'Rescued from high school robotics kit',
      notes: 'Clean solder pads, boots instantly on 5V USB.',
      capabilities: ['Digital I/O', 'Analog input', 'PWM output', 'Serial communication'],
      compatibilities: [
        { platform: 'Arduino (5V Logic)', isCompatible: true, notes: 'Native 5V logic and headers' },
        { platform: 'ESP32 / ESP8266 (3.3V)', isCompatible: true, notes: 'Requires logic level shifter on 5V inputs' },
      ],
      safetyFlags: [
        { level: 'info', title: 'Power Input Limit', description: 'Input limit is 7-12V via barrel jack. Do not apply >5.5V directly to 5V pin.' },
      ],
      specs: [
        { key: 'Microcontroller', value: 'ATmega328P @ 16 MHz' },
        { key: 'Operating Voltage', value: '5V' },
        { key: 'Input Voltage', value: '7-12V (VIN)' },
      ],
      tags: ['microcontroller', 'arduino', '5v'],
    },
    {
      name: 'Soil moisture sensor',
      categoryId: categoryMap['Sensor'],
      partNumber: 'Capacitive v1.2',
      manufacturer: 'Generic / Open Source Hardware',
      description: 'Capacitive v1.2',
      quantity: 1,
      condition: 'Used · working',
      approxWeightG: 9.0,
      estimatedValueUsd: 4.5,
      confidenceScore: 94,
      photoUrl: 'https://images.pexels.com/photos/35652454/pexels-photo-35652454/free-photo-of-arduino-circuit-board-with-tools-on-workbench.jpeg?auto=compress&cs=tinysrgb&w=1200',
      location: 'Drawer 2 - Sensors',
      source: 'Old indoor gardening experiment',
      notes: 'Capacitive trace version - zero copper corrosion.',
      capabilities: ['Soil moisture sensing', 'Analog moisture sensing'],
      compatibilities: [
        { platform: 'Arduino (5V ADC)', isCompatible: true, notes: 'Direct analog connect to A0-A5' },
      ],
      safetyFlags: [],
      specs: [
        { key: 'Operating Voltage', value: '3.3V - 5.5V' },
        { key: 'Output', value: '0-3.0V Analog' },
      ],
      tags: ['sensor', 'soil', 'moisture'],
    },
    {
      name: 'DHT11',
      categoryId: categoryMap['Sensor'],
      partNumber: 'DHT11',
      manufacturer: 'Aosong',
      description: 'Temperature & humidity',
      quantity: 1,
      condition: 'Untested',
      approxWeightG: 3.0,
      estimatedValueUsd: 3.0,
      confidenceScore: 92,
      photoUrl: 'https://images.pexels.com/photos/35652454/pexels-photo-35652454/free-photo-of-arduino-circuit-board-with-tools-on-workbench.jpeg?auto=compress&cs=tinysrgb&w=1200',
      location: 'Drawer 2 - Sensors',
      source: 'Salvaged from weather station kit',
      notes: 'Pins look straight, needs quick serial verification.',
      capabilities: ['Temperature sensing', 'Humidity sensing'],
      compatibilities: [{ platform: 'Arduino (5V)', isCompatible: true, notes: 'Requires pullup resistor' }],
      safetyFlags: [],
      specs: [{ key: 'Temp Accuracy', value: '±2°C' }],
      tags: ['sensor', 'temperature', 'weather'],
    },
    {
      name: 'Photoresistor',
      categoryId: categoryMap['Sensor'],
      partNumber: 'LDR · 5 mm',
      manufacturer: 'Generic Passive',
      description: 'LDR · 5 mm',
      quantity: 1,
      condition: 'Used · working',
      approxWeightG: 1.0,
      estimatedValueUsd: 0.5,
      confidenceScore: 95,
      photoUrl: 'https://images.pexels.com/photos/35652454/pexels-photo-35652454/free-photo-of-arduino-circuit-board-with-tools-on-workbench.jpeg?auto=compress&cs=tinysrgb&w=1200',
      location: 'Drawer 3 - Passives',
      source: 'Harvested from broken solar lawn light',
      notes: 'Smooth resistance sweep from 1k to 1.5M.',
      capabilities: ['Ambient light sensing', 'Variable resistance'],
      compatibilities: [{ platform: 'Arduino / ESP32', isCompatible: true, notes: 'Use with 10k resistor' }],
      safetyFlags: [],
      specs: [{ key: 'Dark Resistance', value: '1-2 MΩ' }],
      tags: ['sensor', 'light', 'ldr'],
    },
    {
      name: 'LEDs',
      categoryId: categoryMap['Output'],
      partNumber: '2 green + 2 red · 5 mm',
      manufacturer: 'Opto-Electronics',
      description: '2 green + 2 red · 5 mm',
      quantity: 4,
      condition: 'Used · working',
      approxWeightG: 4.0,
      estimatedValueUsd: 1.0,
      confidenceScore: 98,
      photoUrl: 'https://images.pexels.com/photos/35652454/pexels-photo-35652454/free-photo-of-arduino-circuit-board-with-tools-on-workbench.jpeg?auto=compress&cs=tinysrgb&w=1200',
      location: 'Component Bin 4',
      source: 'Desoldered from obsolete router panel',
      notes: 'Bright diffused epoxy lens, good legs.',
      capabilities: ['Visual status indication', 'Dual color signaling'],
      compatibilities: [{ platform: 'All 5V/3.3V MCUs', isCompatible: true, notes: 'Use 220Ω resistor' }],
      safetyFlags: [{ level: 'caution', title: 'Resistor Required', description: 'Always place 220Ω series resistor.' }],
      specs: [{ key: 'Forward Voltage', value: '2.0V - 3.0V' }],
      tags: ['output', 'led', 'visual'],
    },
    {
      name: 'Jumper wires',
      categoryId: categoryMap['Interface'],
      partNumber: 'M-M / M-F 20cm',
      manufacturer: 'Generic Prototyping',
      description: 'Assorted 20cm jumper ribbon',
      quantity: 12,
      condition: 'Used · working',
      approxWeightG: 15.0,
      estimatedValueUsd: 3.5,
      confidenceScore: 99,
      photoUrl: 'https://images.pexels.com/photos/35652454/pexels-photo-35652454/free-photo-of-arduino-circuit-board-with-tools-on-workbench.jpeg?auto=compress&cs=tinysrgb&w=1200',
      location: 'Bench Wiring Bin',
      source: 'Student workshop leftovers',
      notes: 'Clean DuPont pins with snug contact friction.',
      capabilities: ['Signal connection', 'Power distribution'],
      compatibilities: [{ platform: '2.54mm pitch', isCompatible: true }],
      safetyFlags: [],
      specs: [{ key: 'Length', value: '20 cm' }],
      tags: ['wiring', 'jumper'],
    },
    {
      name: 'Mini breadboard',
      categoryId: categoryMap['Interface'],
      partNumber: '400-Point Solderless',
      manufacturer: 'Generic Prototyping',
      description: 'Half-size white solderless breadboard',
      quantity: 1,
      condition: 'Used · working',
      approxWeightG: 32.0,
      estimatedValueUsd: 4.0,
      confidenceScore: 97,
      photoUrl: 'https://images.pexels.com/photos/35652454/pexels-photo-35652454/free-photo-of-arduino-circuit-board-with-tools-on-workbench.jpeg?auto=compress&cs=tinysrgb&w=1200',
      location: 'Main Bench Tray',
      source: 'Maker meetup exchange',
      notes: 'Central divider and power rails all intact.',
      capabilities: ['Solderless prototyping'],
      compatibilities: [{ platform: 'Standard breadboard', isCompatible: true }],
      safetyFlags: [],
      specs: [{ key: 'Tie Points', value: '400 points' }],
      tags: ['interface', 'breadboard'],
    },
  ];

  for (const comp of componentsToSeed) {
    await prisma.component.create({
      data: {
        workspaceId: workspace.id,
        categoryId: comp.categoryId,
        name: comp.name,
        partNumber: comp.partNumber,
        manufacturer: comp.manufacturer,
        description: comp.description,
        quantity: comp.quantity,
        condition: comp.condition,
        approxWeightG: comp.approxWeightG,
        estimatedValueUsd: comp.estimatedValueUsd,
        confidenceScore: comp.confidenceScore,
        photoUrl: comp.photoUrl,
        location: comp.location,
        source: comp.source,
        notes: comp.notes,
        capabilities: {
          create: comp.capabilities.map((c) => ({ name: c, category: 'general', provenance: 'catalog' })),
        },
        compatibilities: {
          create: comp.compatibilities.map((cp) => ({ platform: cp.platform, isCompatible: cp.isCompatible, notes: cp.notes })),
        },
        safetyFlags: {
          create: comp.safetyFlags.map((sf) => ({ level: sf.level, title: sf.title, description: sf.description })),
        },
        specifications: {
          create: comp.specs.map((s) => ({ key: s.key, value: s.value, provenance: 'catalog' })),
        },
        tags: {
          create: comp.tags.map((t) => ({ tag: t })),
        },
      },
    });
  }

  // A compact but varied institutional dataset powers the Classroom & teams demo.
  // It is intentionally separate from Alex's private bench.
  await prisma.component.deleteMany({ where: { workspaceId: labWorkspace.id } });
  await prisma.impactEvent.deleteMany({ where: { workspaceId: labWorkspace.id } });
  const labParts = [
    { name: 'ESP32 DevKit boards', category: 'Microcontroller', quantity: 8, weight: 12, value: 8.5, condition: 'Used · working' },
    { name: 'Ultrasonic distance sensors', category: 'Sensor', quantity: 14, weight: 9, value: 2.2, condition: 'Used · working' },
    { name: 'Mini servo motors', category: 'Actuator', quantity: 6, weight: 18, value: 4.0, condition: 'Untested' },
    { name: 'LED assortments', category: 'Output', quantity: 35, weight: 1, value: 0.25, condition: 'Used · working' },
    { name: 'Breadboards and jumpers', category: 'Interface', quantity: 18, weight: 24, value: 3.5, condition: 'Used · working' },
  ];
  for (const part of labParts) {
    await prisma.component.create({ data: {
      workspaceId: labWorkspace.id, categoryId: categoryMap[part.category], name: part.name,
      quantity: part.quantity, approxWeightG: part.weight, estimatedValueUsd: part.value,
      condition: part.condition, location: 'ECE salvage cabinet', source: 'Departmental e-waste intake',
      description: 'Seeded lab inventory for the Classroom & teams demo.',
    }});
  }
  await prisma.impactEvent.createMany({ data: [
    { workspaceId: labWorkspace.id, eventType: 'component_rescued', quantityUnits: 81, massGrams: 1040, avoidedCostUsd: 236.5, co2eAvoidedKg: 18.72, notes: 'Autumn lab intake, catalogued by student volunteers', occurredAt: new Date(Date.now() - 21 * 86400000) },
    { workspaceId: labWorkspace.id, eventType: 'component_reused', quantityUnits: 22, massGrams: 310, avoidedCostUsd: 74.0, co2eAvoidedKg: 5.58, notes: 'Introductory physical-computing builds', occurredAt: new Date(Date.now() - 6 * 86400000) },
  ]});

  // 4. Curated Project & Outcomes
  const project = await prisma.project.create({
    data: {
      projectNumber: '014',
      title: 'Smart plant monitor',
      tagline: 'A second life for your parts. A little help for your plants.',
      heroHeading: 'Your plant asks for water. Your old parts answer.',
      heroSubheading: 'Read soil moisture with your capacitive sensor. An Arduino turns that reading into a green "happy" or red "water me" light.',
      description: 'Know when your plant needs a drink. Turn soil readings into a simple green / red light indicator.',
      difficulty: 'Beginner friendly',
      estimatedHours: '2–3 hours',
      estimatedExtraCost: 4.50,
      flowStages: 'SENSE -> INTERPRET -> SIGNAL',
      category: 'Environment & Plants',
      isFeatured: true,
      imageUrl: 'https://images.pexels.com/photos/35652454/pexels-photo-35652454/free-photo-of-arduino-circuit-board-with-tools-on-workbench.jpeg?auto=compress&cs=tinysrgb&w=1600',
      requirements: {
        create: [
          { componentName: 'Arduino Uno R3', capabilityNeeded: 'Analog input + digital control', category: 'Microcontroller', quantityNeeded: 1, isOptional: false, unitCostUsd: 22.0 },
          { componentName: 'Capacitive moisture sensor', capabilityNeeded: 'Soil moisture sensing', category: 'Sensor', quantityNeeded: 1, isOptional: false, unitCostUsd: 4.5 },
          { componentName: 'LEDs · green + red', capabilityNeeded: 'Visual status output', category: 'Output', quantityNeeded: 2, isOptional: false, unitCostUsd: 1.0 },
          { componentName: 'Jumper wires', capabilityNeeded: 'Signal / power connection', category: 'Interface', quantityNeeded: 6, isOptional: false, unitCostUsd: 1.5 },
          { componentName: 'Mini breadboard', capabilityNeeded: 'Solderless prototyping', category: 'Interface', quantityNeeded: 1, isOptional: false, unitCostUsd: 4.0 },
        ],
      },
      buildSteps: {
        create: [
          { stepNumber: 1, title: 'Inspect and Clean Rescued Probe', description: 'Clean probe traces with alcohol.', durationMinutes: 10, milestoneCheck: 'Pads clean.' },
          { stepNumber: 2, title: 'Mount Circuit on Breadboard', description: 'Wire LEDs with 220Ω series resistors.', durationMinutes: 20, milestoneCheck: 'LED grounded.' },
          { stepNumber: 3, title: 'Wire Sensor to Analog Pin A0', description: 'Connect VCC, GND, and AOUT.', durationMinutes: 15, milestoneCheck: 'Header seated.' },
          { stepNumber: 4, title: 'Upload & Test Firmware', description: 'Flash Arduino firmware over USB.', durationMinutes: 20, milestoneCheck: 'Serial telemetry live.' },
          { stepNumber: 5, title: 'Calibrate Dry/Wet Thresholds', description: 'Record moisture thresholds.', durationMinutes: 15, milestoneCheck: 'LED changes color.' },
        ],
      },
    },
  });

  // 5. Project Workspace & Outcome
  const projectWorkspace = await prisma.projectWorkspace.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      projectId: project.id,
      title: 'Smart plant monitor',
      tagline: 'A small build that gives your rescued electronics a useful second life.',
      status: 'completed',
      feasibilityScore: 86,
      currentStepIndex: 5,
      isPublished: true,
      completedAt: new Date(),
      reflection: 'Successfully salvaged an old robotics kit Uno and capacitive sensor to monitor an indoor basil plant. Zero soldering required.',
      outcome: {
        create: {
          summaryStory: 'Rescued an Arduino Uno and capacitive probe from a discarded student project. Built a zero-app soil moisture alert in 2 hours.',
          challengesLearned: 'Capacitive probes are much more reliable than resistive forks which corrode in moist soil within weeks.',
          hardwareMods: 'Added a 220Ω current limiter to protect pin 8/9 LED drivers.',
          photoUrl: 'https://images.pexels.com/photos/35652454/pexels-photo-35652454/free-photo-of-arduino-circuit-board-with-tools-on-workbench.jpeg?auto=compress&cs=tinysrgb&w=1600',
          totalPartsReused: 13,
          totalCostAvoided: 31.50,
          massDivertedGrams: 180.0,
        },
      },
      buildSteps: {
        create: [
          { stepNumber: 1, title: 'Inspect and Clean Rescued Probe', description: 'Clean probe traces with alcohol.', durationMinutes: 10, isCompleted: true, completedAt: new Date() },
          { stepNumber: 2, title: 'Mount Circuit on Breadboard', description: 'Wire LEDs with 220Ω series resistors.', durationMinutes: 20, isCompleted: true, completedAt: new Date() },
          { stepNumber: 3, title: 'Wire Sensor to Analog Pin A0', description: 'Connect VCC, GND, and AOUT.', durationMinutes: 15, isCompleted: true, completedAt: new Date() },
          { stepNumber: 4, title: 'Upload & Test Firmware', description: 'Flash Arduino firmware over USB.', durationMinutes: 20, isCompleted: true, completedAt: new Date() },
          { stepNumber: 5, title: 'Calibrate Dry/Wet Thresholds', description: 'Record moisture thresholds.', durationMinutes: 15, isCompleted: true, completedAt: new Date() },
        ],
      },
    },
  });

  // 6. Community Publications
  const publication1 = await prisma.communityPublication.create({
    data: {
      workspaceProjectId: projectWorkspace.id,
      projectId: project.id,
      authorId: user.id,
      title: 'Smart Plant Hydration Monitor',
      tagline: 'Dual-LED soil moisture alert system with zero soldering.',
      description: 'Prevent root rot and underwatering on desk plants. An Arduino Uno reads capacitive analog data and signals plant health through green and red status LEDs.',
      difficulty: 'Beginner friendly',
      category: 'Environment & Plants',
      estimatedHours: '2–3 hours',
      coverImageUrl: 'https://images.pexels.com/photos/35652454/pexels-photo-35652454/free-photo-of-arduino-circuit-board-with-tools-on-workbench.jpeg?auto=compress&cs=tinysrgb&w=1600',
      flowStages: 'SENSE -> INTERPRET -> SIGNAL',
      partsReusedCount: 13,
      avoidedCostUsd: 31.50,
      divertedMassKg: 0.18,
      tags: JSON.stringify(['arduino', 'plants', 'gardening', 'no-soldering', 'sensors']),
      buildHighlights: 'Uses a capacitive moisture sensor which prevents galvanic corrosion compared to cheap copper forks.',
      safetyNotes: '5V low voltage circuit. Keep water spray away from the Arduino USB jack.',
      remixCount: 4,
      helpfulCount: 19,
      isPublished: true,
      comments: {
        create: [
          {
            authorId: educatorUser.id,
            authorName: 'Dr. Sarah Chen',
            content: 'Great implementation for freshman engineering labs! Solderless breadboarding makes it reusable every semester.',
          },
          {
            authorId: user.id,
            authorName: 'Alex Kim',
            content: 'Thanks Dr. Chen! The capacitive probe has been running on my desk for 3 weeks with zero corrosion.',
          },
        ],
      },
    },
  });

  // 7. Impact Events Ledger
  await prisma.impactEvent.createMany({
    data: [
      {
        workspaceId: workspace.id,
        eventType: 'build_completed',
        quantityUnits: 13,
        massGrams: 180.0,
        avoidedCostUsd: 31.50,
        co2eAvoidedKg: 3.24,
        methodologyVersion: 'v3.0-standard',
        notes: 'Completed Smart Plant Monitor build',
        occurredAt: new Date(),
      },
      {
        workspaceId: workspace.id,
        eventType: 'component_rescued',
        quantityUnits: 24,
        massGrams: 89.0,
        avoidedCostUsd: 48.00,
        co2eAvoidedKg: 1.60,
        methodologyVersion: 'v3.0-standard',
        notes: 'Inventoried 24 salvaged items on maker bench',
        occurredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Phase 3 seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Phase 3 seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
