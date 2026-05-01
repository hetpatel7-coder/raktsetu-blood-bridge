export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodType = (typeof BLOOD_TYPES)[number];

export const CITIES = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"] as const;

// Recipient -> compatible donor types
export const COMPATIBILITY: Record<BloodType, BloodType[]> = {
  "O+":  ["O+", "O-"],
  "O-":  ["O-"],
  "A+":  ["A+", "A-", "O+", "O-"],
  "A-":  ["A-", "O-"],
  "B+":  ["B+", "B-", "O+", "O-"],
  "B-":  ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["A-", "B-", "AB-", "O-"],
};

export const CITY_COORDS: Record<string, [number, number]> = {
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311],
  Vadodara: [22.3072, 73.1812],
  Rajkot: [22.3039, 70.8022],
  Gandhinagar: [23.2156, 72.6369],
};
