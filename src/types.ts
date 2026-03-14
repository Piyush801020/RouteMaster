export type Role = 'admin' | 'user' | 'agency';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: Role;
}

export interface Agency {
  id: string;
  name: string;
  description: string;
  contact: string;
  logo: string;
  ownerUid: string;
}

export interface Package {
  id: string;
  agencyId: string;
  title: string;
  description: string;
  price: number;
  vehicleType: 'Bus' | 'Car' | 'Train' | 'Flight';
  duration: string;
  startLocation: string;
  endLocation: string;
}

export interface Waypoint {
  name: string;
  type: 'eatery' | 'photo' | 'emergency' | 'rest' | 'attraction';
  lat: number;
  lng: number;
  description: string;
}

export interface Trip {
  id?: string;
  userId: string;
  startLocation: string;
  endLocation: string;
  waypoints: Waypoint[];
  estimatedCost: number;
  createdAt: any;
}
