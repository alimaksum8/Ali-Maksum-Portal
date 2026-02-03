
export enum PortalView {
  LANDING = 'LANDING',
  ADMIN = 'ADMIN',
  INVITATION = 'INVITATION'
}

export interface InvitationConfig {
  groomName: string;
  brideName: string;
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
