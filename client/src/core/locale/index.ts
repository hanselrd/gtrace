import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import en from './en';
import es from './es';

export interface IStrings extends LocalizedStringsMethods {
  notFound: string;
  login: string;
  logout: string;
  signup: string;
  submit: string;
  navigation: string;
  loading: string;
  user: string;
  userId: string;
  name: string;
  dob: string;
  email: string;
  password: string;
  home: string;
  chat: string;
  games: string;
  profile: string;
  settings: string;
  language: string;
  english: string;
  spanish: string;
  online: string;
  yes: string;
  no: string;
  role: string;
  joined: string;
  show: string;
  verifyingCredentials: string;
  createAnAccount: string;
  alreadyHaveAnAccount: string;
}

const strings: IStrings = new LocalizedStrings({ en, es });

export default strings;
