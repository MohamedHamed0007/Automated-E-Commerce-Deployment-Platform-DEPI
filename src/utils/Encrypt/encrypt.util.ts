import CryptoJS from 'crypto-js';
import { env } from '../../config/env/env';

export const encrypt = (text: string) => {
  if (!env.JWT.SECRET) {
    throw new Error('JWT secret is not defined');
  }
  return CryptoJS.AES.encrypt(text, env.JWT.SECRET).toString();
};

export const decrypt = (chiphertext: string) => {
  if (!env.JWT.SECRET) {
    throw new Error('JWT secret is not defined');
  }
  const bytes = CryptoJS.AES.decrypt(chiphertext, env.JWT.SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};
