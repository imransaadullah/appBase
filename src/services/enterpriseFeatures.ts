import * as Updates from 'expo-updates';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

export interface AppConfig {
  apiUrl: string;
  features: {
    analytics: boolean;
    crashReporting: boolean;
    pushNotifications: boolean;
    biometricAuth: boolean;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
  };
  version: string;
}

export interface UpdateInfo {
  isAvailable: boolean;
  manifest?: any;
  isRollBackToEmbedded?: boolean;
}

export class EnterpriseService {
  private static readonly CONFIG_KEY = 'enterprise_config';
  private static readonly FEATURE_FLAGS_KEY = 'feature_flags';
  private static config: AppConfig | null = null;

  static async initialize(): Promise<void> {
    try {
      // Load enterprise configuration
      await this.loadConfiguration();
      
      // Check for updates in production
      if (!__DEV__) {
        await this.checkForUpdates();
      }
    } catch (error) {
      console.error('Failed to initialize enterprise service:', error);
    }
  }

  // Configuration Management
  static async loadConfiguration(): Promise<AppConfig> {
    try {
      const configData = await SecureStore.getItemAsync(this.CONFIG_KEY);
      
      if (configData) {
        this.config = JSON.parse(configData);
      } else {
        // Default configuration
        this.config = {
          apiUrl: Constants.expoConfig?.extra?.apiUrl || 'https://api.example.com',
          features: {
            analytics: true,
            crashReporting: true,
            pushNotifications: true,
            biometricAuth: true,
          },
          theme: {
            primaryColor: '#007AFF',
            secondaryColor: '#5856D6',
            darkMode: false,
          },
          version: Constants.expoConfig?.version || '1.0.0',
        };
        
        await this.saveConfiguration(this.config);
      }
      
      return this.config!;
    } catch (error) {
      console.error('Error loading configuration:', error);
      throw error;
    }
  }

  static async saveConfiguration(config: AppConfig): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.CONFIG_KEY, JSON.stringify(config));
      this.config = config;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }

  static getConfiguration(): AppConfig | null {
    return this.config;
  }

  // Feature Flag Management
  static async setFeatureFlag(feature: string, enabled: boolean): Promise<void> {
    try {
      const flags = await this.getFeatureFlags();
      flags[feature] = enabled;
      await SecureStore.setItemAsync(this.FEATURE_FLAGS_KEY, JSON.stringify(flags));
    } catch (error) {
      console.error('Error setting feature flag:', error);
    }
  }

  static async getFeatureFlags(): Promise<Record<string, boolean>> {
    try {
      const flagsData = await SecureStore.getItemAsync(this.FEATURE_FLAGS_KEY);
      return flagsData ? JSON.parse(flagsData) : {};
    } catch (error) {
      console.error('Error getting feature flags:', error);
      return {};
    }
  }

  static async isFeatureEnabled(feature: string): Promise<boolean> {
    try {
      const flags = await this.getFeatureFlags();
      return flags[feature] ?? false;
    } catch (error) {
      console.error('Error checking feature flag:', error);
      return false;
    }
  }

  // Over-the-Air Updates
  static async checkForUpdates(): Promise<UpdateInfo> {
    try {
      const update = await Updates.checkForUpdateAsync();
      
      return {
        isAvailable: update.isAvailable,
        manifest: update.manifest,
        isRollBackToEmbedded: update.isRollBackToEmbedded,
      };
    } catch (error) {
      console.error('Error checking for updates:', error);
      return { isAvailable: false };
    }
  }

  static async downloadAndInstallUpdate(): Promise<boolean> {
    try {
      const updateInfo = await this.checkForUpdates();
      
      if (updateInfo.isAvailable) {
        const fetchResult = await Updates.fetchUpdateAsync();
        
        if (fetchResult.isNew) {
          await Updates.reloadAsync();
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error downloading and installing update:', error);
      return false;
    }
  }

  static async rollbackToEmbedded(): Promise<void> {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error rolling back to embedded version:', error);
    }
  }

  // Remote Configuration
  static async fetchRemoteConfig(): Promise<void> {
    try {
      const config = this.getConfiguration();
      if (!config) return;

      const response = await fetch(`${config.apiUrl}/config`);
      const remoteConfig = await response.json();
      
      // Merge with local config
      const updatedConfig = {
        ...config,
        ...remoteConfig,
        features: {
          ...config.features,
          ...remoteConfig.features,
        },
        theme: {
          ...config.theme,
          ...remoteConfig.theme,
        },
      };
      
      await this.saveConfiguration(updatedConfig);
    } catch (error) {
      console.error('Error fetching remote config:', error);
    }
  }

  // App Version Management
  static getAppVersion(): string {
    return Constants.expoConfig?.version || '1.0.0';
  }

  static getBuildNumber(): string {
    return Constants.expoConfig?.ios?.buildNumber || 
           Constants.expoConfig?.android?.versionCode?.toString() || 
           '1';
  }

  static getUpdateId(): string | null {
    return Updates.updateId || null;
  }

  static getChannel(): string {
    return Updates.channel || 'default';
  }

  static getRuntimeVersion(): string {
    return Updates.runtimeVersion || '1.0.0';
  }

  // Environment Detection
  static isProduction(): boolean {
    return !__DEV__ && Constants.expoConfig?.extra?.environment === 'production';
  }

  static isStaging(): boolean {
    return !__DEV__ && Constants.expoConfig?.extra?.environment === 'staging';
  }

  static isDevelopment(): boolean {
    return __DEV__;
  }

  // Device Management
  static async registerDevice(deviceToken?: string): Promise<void> {
    try {
      const config = this.getConfiguration();
      if (!config) return;

      const deviceInfo = {
        deviceId: Constants.deviceId,
        platform: Constants.platform,
        appVersion: this.getAppVersion(),
        buildNumber: this.getBuildNumber(),
        deviceToken,
        registeredAt: new Date().toISOString(),
      };

      await fetch(`${config.apiUrl}/devices/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceInfo),
      });
    } catch (error) {
      console.error('Error registering device:', error);
    }
  }

  // License Management
  static async validateLicense(licenseKey: string): Promise<boolean> {
    try {
      const config = this.getConfiguration();
      if (!config) return false;

      const response = await fetch(`${config.apiUrl}/license/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseKey }),
      });

      const result = await response.json();
      return result.valid === true;
    } catch (error) {
      console.error('Error validating license:', error);
      return false;
    }
  }

  // Maintenance Mode
  static async checkMaintenanceMode(): Promise<{ enabled: boolean; message?: string }> {
    try {
      const config = this.getConfiguration();
      if (!config) return { enabled: false };

      const response = await fetch(`${config.apiUrl}/maintenance`);
      const result = await response.json();
      
      return {
        enabled: result.enabled === true,
        message: result.message,
      };
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
      return { enabled: false };
    }
  }
} 