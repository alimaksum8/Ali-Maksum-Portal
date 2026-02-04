
export enum PortalView {
  LANDING = 'LANDING',
  ADMIN = 'ADMIN',
  INVITATION = 'INVITATION'
}

export interface RSVP {
  id: string;
  name: string;
  count: number;
  status: 'yes' | 'no';
  timestamp: string;
}

export interface InvitationConfig {
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  showMuballigh: boolean;
  muballighs: string[];
  eventDateIso: string;
  eventDateDisplay: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  message: string;
}

export interface GreetingResponse {
  message: string;
  sentiment: string;
}
