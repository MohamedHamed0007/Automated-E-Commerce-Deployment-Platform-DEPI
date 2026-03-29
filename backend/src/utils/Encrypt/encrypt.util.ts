import CryptoJS from 'crypto-js';
import { env } from '../../config/env/env';

const SECRET = env.JWT?.SECRET || env.JWT_SECRET;
if (!SECRET) {
  throw new Error('JWT secret is not defined');
}

export const encrypt = (text: string) => {
  return CryptoJS.AES.encrypt(text, SECRET).toString();
};

export const decrypt = (chiphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(chiphertext, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};
