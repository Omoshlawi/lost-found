import { Session as BSession, User as BUser } from 'better-auth';

export interface User extends BUser {
  isAnonymous: boolean;
  role: string;
  username?: string;
  phoneNumber?: string;
  banned: boolean;
  banReason?: string;
  banExpires?: Date;
  displayUsername?: string;
}
export interface Session extends BSession {
  activeOrganizationId?: string;
  activeTeamId?: string;
  impersonatedBy?: string;
}

export interface UserSession {
  user?: User;
  session?: Session;
}
