import type { Appliance } from '@/types';

export const SAMPLE_APPLIANCES: Appliance[] = [
  { id: 'ac-1', name: 'Air Conditioner', watts: 1500, quantity: 1, hoursPerDay: 6 },
  { id: 'fridge-1', name: 'Refrigerator', watts: 200, quantity: 1, hoursPerDay: 24 },
  { id: 'fan-1', name: 'Ceiling Fan', watts: 75, quantity: 3, hoursPerDay: 10 },
  { id: 'tv-1', name: 'Television', watts: 120, quantity: 1, hoursPerDay: 4 },
  { id: 'led-1', name: 'LED Light', watts: 10, quantity: 6, hoursPerDay: 5 },
];

export const DEFAULT_RATE = 8;

export const SAVING_TIPS: { title: string; detail: string }[] = [
  {
    title: 'Raise your AC temperature by 1°C',
    detail:
      'Each degree above 24°C can cut AC energy use by roughly 6–10%. Over a month that adds up significantly for a 1500W unit.',
  },
  {
    title: 'Switch off the TV and set-top box',
    detail:
      'Standby power still flows when devices are "off" but plugged in. Turning them off at the socket avoids silent drain.',
  },
  {
    title: 'Use fans instead of AC when possible',
    detail:
      'A 75W ceiling fan uses a fraction of the energy of an AC. Rely on fans during milder hours.',
  },
  {
    title: 'Replace old bulbs with LEDs',
    detail:
      'A 10W LED gives similar light to a 60W incandescent, an ~80% reduction per bulb.',
  },
  {
    title: 'Keep the refrigerator away from heat',
    detail:
      'Placing a fridge near the stove or in direct sunlight makes its compressor run longer, raising consumption.',
  },
  {
    title: 'Clean AC filters monthly',
    detail:
      'Clogged filters reduce airflow and force the compressor to work harder, increasing energy use.',
  },
];
