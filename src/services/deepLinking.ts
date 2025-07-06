import * as Linking from 'expo-linking';
import { NavigationContainerRef } from '@react-navigation/native';

export interface DeepLinkRoute {
  screen: string;
  params?: Record<string, any>;
}

export class DeepLinkingService {
  private static navigationRef: NavigationContainerRef<any> | null = null;
  private static isInitialized = false;

  static initialize(navigationRef: NavigationContainerRef<any>): void {
    this.navigationRef = navigationRef;
    this.isInitialized = true;
    
    // Listen for incoming links when app is already open
    Linking.addEventListener('url', this.handleDeepLink);
  }

  static cleanup(): void {
    if (this.isInitialized) {
      Linking.removeEventListener('url', this.handleDeepLink);
    }
  }

  private static handleDeepLink = (event: { url: string }): void => {
    const route = this.parseDeepLink(event.url);
    if (route) {
      this.navigateToRoute(route);
    }
  };

  static parseDeepLink(url: string): DeepLinkRoute | null {
    try {
      const parsed = Linking.parse(url);
      const { hostname, path, queryParams } = parsed;

      // Handle different URL patterns
      if (hostname === 'auth') {
        return {
          screen: 'Auth',
          params: queryParams,
        };
      }

      if (hostname === 'profile') {
        return {
          screen: 'Profile',
          params: queryParams,
        };
      }

      if (hostname === 'reset-password') {
        return {
          screen: 'ResetPassword',
          params: queryParams,
        };
      }

      // Handle path-based routing
      if (path) {
        const pathSegments = path.split('/').filter(Boolean);
        
        if (pathSegments[0] === 'user' && pathSegments[1]) {
          return {
            screen: 'Profile',
            params: { userId: pathSegments[1], ...queryParams },
          };
        }

        if (pathSegments[0] === 'share' && pathSegments[1]) {
          return {
            screen: 'Share',
            params: { shareId: pathSegments[1], ...queryParams },
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error parsing deep link:', error);
      return null;
    }
  }

  static async navigateToRoute(route: DeepLinkRoute): Promise<void> {
    if (!this.navigationRef?.isReady()) {
      // Wait for navigation to be ready
      setTimeout(() => this.navigateToRoute(route), 100);
      return;
    }

    try {
      if (route.params) {
        (this.navigationRef as any).navigate(route.screen, route.params);
      } else {
        (this.navigationRef as any).navigate(route.screen);
      }
    } catch (error) {
      console.error('Error navigating to route:', error);
    }
  }

  static async handleInitialURL(): Promise<void> {
    try {
      const initialURL = await Linking.getInitialURL();
      if (initialURL) {
        const route = this.parseDeepLink(initialURL);
        if (route) {
          // Delay navigation to ensure navigation is ready
          setTimeout(() => this.navigateToRoute(route), 500);
        }
      }
    } catch (error) {
      console.error('Error handling initial URL:', error);
    }
  }

  // Utility methods for creating deep links
  static createDeepLink(path: string, params?: Record<string, any>): string {
    const url = Linking.createURL(path, params);
    return url;
  }

  static createShareLink(shareId: string): string {
    return this.createDeepLink(`/share/${shareId}`);
  }

  static createUserProfileLink(userId: string): string {
    return this.createDeepLink(`/user/${userId}`);
  }

  static createResetPasswordLink(token: string): string {
    return this.createDeepLink('/reset-password', { token });
  }

  // Share functionality
  static async shareDeepLink(
    url: string,
    message: string = 'Check this out!'
  ): Promise<void> {
    try {
      await Linking.openURL(`mailto:?subject=${encodeURIComponent(message)}&body=${encodeURIComponent(url)}`);
    } catch (error) {
      console.error('Error sharing deep link:', error);
    }
  }

  // Check if URL can be opened
  static async canOpenURL(url: string): Promise<boolean> {
    try {
      return await Linking.canOpenURL(url);
    } catch (error) {
      console.error('Error checking URL:', error);
      return false;
    }
  }

  // Open external URL
  static async openExternalURL(url: string): Promise<void> {
    try {
      const canOpen = await this.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.warn('Cannot open URL:', url);
      }
    } catch (error) {
      console.error('Error opening external URL:', error);
    }
  }
} 