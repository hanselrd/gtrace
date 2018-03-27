import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import en from './en';
import es from './es';

export interface IStrings extends LocalizedStringsMethods {
  loading: string;
  user: string;
  userId: string;
  name: string;
  dob: string;
  email: string;
  password: string;
  home: string;
  profile: string;
  language: string;
  english: string;
  spanish: string;
  online: string;
  yes: string;
  no: string;
  role: string;
  joined: string;
}

const strings: IStrings = new LocalizedStrings({ en, es });

export default strings;
