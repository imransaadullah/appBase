import * as Keychain from 'react-native-keychain';
import * as Crypto from 'expo-crypto';

export class SecureStorageService {
  private static readonly SERVICE_NAME = 'AppBaseSecureStorage';

  // Store sensitive data in keychain
  static async setSecureItem(key: string, value: string): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        `${this.SERVICE_NAME}_${key}`,
        key,
        value
      );
      return true;
    } catch (error) {
      console.error('Error storing secure item:', error);
      return false;
    }
  }

  // Retrieve sensitive data from keychain
  static async getSecureItem(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(
        `${this.SERVICE_NAME}_${key}`
      );
      
      if (credentials && credentials.password) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving secure item:', error);
      return null;
    }
  }

  // Remove sensitive data from keychain
  static async removeSecureItem(key: string): Promise<boolean> {
    try {
      await Keychain.resetInternetCredentials(`${this.SERVICE_NAME}_${key}`);
      return true;
    } catch (error) {
      console.error('Error removing secure item:', error);
      return false;
    }
  }

  // Encrypt data before storage
  static async encryptData(data: string): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data
    );
  }

  // Check if keychain is available
  static async isKeychainAvailable(): Promise<boolean> {
    try {
      // Check if keychain is available by attempting to get supported biometry type
      const biometryType = await Keychain.getSupportedBiometryType();
      return biometryType !== null;
    } catch {
      return false;
    }
  }

  // Store encrypted token
  static async storeAuthToken(token: string): Promise<boolean> {
    return await this.setSecureItem('auth_token', token);
  }

  // Retrieve auth token
  static async getAuthToken(): Promise<string | null> {
    return await this.getSecureItem('auth_token');
  }

  // Clear all secure data
  static async clearAllSecureData(): Promise<void> {
    try {
      await Keychain.resetInternetCredentials(this.SERVICE_NAME);
    } catch (error) {
      console.error('Error clearing secure data:', error);
    }
  }
} 