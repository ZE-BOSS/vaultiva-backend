import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secret-encryption-key';

@Injectable()
export class EncryptionUtil {
  encrypt(text: string): string {
    if (!text) return text;
    try {
      return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return text;
    }
  }

  decrypt(encryptedText: string): string {
    if (!encryptedText) return encryptedText;
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedText;
    }
  }
}
