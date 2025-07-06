import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

export class BiometricAuthService {
  static async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  static async getSupportedTypes(): Promise<number[]> {
    return await LocalAuthentication.supportedAuthenticationTypesAsync();
  }

  static async authenticate(
    promptMessage: string = 'Authenticate to continue'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const isAvailable = await this.isAvailable();
      
      if (!isAvailable) {
        return { 
          success: false, 
          error: 'Biometric authentication is not available on this device' 
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error || 'Authentication failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: `Authentication error: ${error}` 
      };
    }
  }

  static async authenticateWithPrompt(
    title: string,
    subtitle: string
  ): Promise<boolean> {
    const result = await this.authenticate(`${title}\n${subtitle}`);
    
    if (!result.success && result.error) {
      Alert.alert('Authentication Failed', result.error);
      return false;
    }
    
    return result.success;
  }
} 