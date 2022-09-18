import { StaticAuthProvider } from '@twurple/auth';
import { CLIENT_ID, CLIENT_TOKEN } from './App';

export const authProvider = new StaticAuthProvider(CLIENT_ID, CLIENT_TOKEN);
