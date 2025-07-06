import * as Sentry from '@sentry/react-native';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
}

export class AnalyticsService {
  private static isInitialized = false;
  private static userId: string | null = null;

  static async initialize(sentryDsn?: string): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Sentry for crash reporting
      if (sentryDsn) {
        Sentry.init({
          dsn: sentryDsn,
          environment: __DEV__ ? 'development' : 'production',
          enableAutoSessionTracking: true,
          sessionTrackingIntervalMillis: 30000,
          beforeSend(event: any) {
            // Filter out development errors in production
            if (!__DEV__ && event.environment === 'development') {
              return null;
            }
            return event;
          },
        });
      }

      this.isInitialized = true;
      console.log('Analytics service initialized');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  static setUserId(userId: string): void {
    this.userId = userId;
    Sentry.setUser({ id: userId });
  }

  static async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const enrichedEvent = {
        ...event,
        properties: {
          ...event.properties,
          timestamp: new Date().toISOString(),
          platform: Constants.platform?.ios ? 'ios' : 'android',
          appVersion: Application.nativeApplicationVersion,
          buildVersion: Application.nativeBuildVersion,
          userId: event.userId || this.userId,
        },
      };

      // Track with Sentry
      Sentry.addBreadcrumb({
        message: event.name,
        category: 'user_action',
        level: 'info',
        data: enrichedEvent.properties,
      });

      // Log for development
      if (__DEV__) {
        console.log('📊 Analytics Event:', enrichedEvent);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  static async trackScreen(screenName: string, properties?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      name: 'screen_view',
      properties: {
        screen_name: screenName,
        ...properties,
      },
    });
  }

  static async trackError(error: Error, context?: Record<string, any>): Promise<void> {
    try {
      Sentry.captureException(error, {
        contexts: {
          custom: context,
        },
      });

      await this.trackEvent({
        name: 'error_occurred',
        properties: {
          error_message: error.message,
          error_stack: error.stack,
          ...context,
        },
      });
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
  }

  static async trackPerformance(
    operation: string,
    duration: number,
    properties?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent({
      name: 'performance_metric',
      properties: {
        operation,
        duration_ms: duration,
        ...properties,
      },
    });
  }

  // Convenience methods for common events
  static async trackLogin(method: string): Promise<void> {
    await this.trackEvent({
      name: 'user_login',
      properties: { method },
    });
  }

  static async trackLogout(): Promise<void> {
    await this.trackEvent({
      name: 'user_logout',
    });
  }

  static async trackSignup(method: string): Promise<void> {
    await this.trackEvent({
      name: 'user_signup',
      properties: { method },
    });
  }

  static async trackPurchase(
    productId: string,
    amount: number,
    currency: string = 'USD'
  ): Promise<void> {
    await this.trackEvent({
      name: 'purchase',
      properties: {
        product_id: productId,
        amount,
        currency,
      },
    });
  }
} 