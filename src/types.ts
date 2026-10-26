export type Appliance = {
  id: string;
  name: string;
  watts: number;
  quantity: number;
  hoursPerDay: number;
};

export type ApplianceDraft = {
  name: string;
  watts: string;
  quantity: string;
  hoursPerDay: string;
};

export type Totals = {
  dailyKwh: number;
  monthlyKwh: number;
  monthlyCost: number;
  topAppliance: { name: string; monthlyKwh: number } | null;
  perAppliance: {
    appliance: Appliance;
    dailyKwh: number;
    monthlyKwh: number;
    monthlyCost: number;
  }[];
};
