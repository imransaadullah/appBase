import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from './api';

export interface SyncItem {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  data?: any;
  timestamp: number;
  retryCount: number;
}

export interface OfflineData {
  [key: string]: any;
}

export class OfflineSyncService {
  private static readonly SYNC_QUEUE_KEY = 'offline_sync_queue';
  private static readonly OFFLINE_DATA_KEY = 'offline_data';
  private static readonly MAX_RETRY_COUNT = 3;
  private static isOnline = true;
  private static syncInProgress = false;

  static async initialize(): Promise<void> {
    // Monitor network status
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      // If we just came back online, sync pending items
      if (wasOffline && this.isOnline) {
        this.syncPendingItems();
      }
    });

    // Get initial network state
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected ?? false;
  }

  static async addToSyncQueue(item: Omit<SyncItem, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const syncItem: SyncItem = {
      ...item,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    try {
      const queue = await this.getSyncQueue();
      queue.push(syncItem);
      await AsyncStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  static async getSyncQueue(): Promise<SyncItem[]> {
    try {
      const queueData = await AsyncStorage.getItem(this.SYNC_QUEUE_KEY);
      return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error('Error getting sync queue:', error);
      return [];
    }
  }

  static async syncPendingItems(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;

    try {
      const queue = await this.getSyncQueue();
      const failedItems: SyncItem[] = [];

      for (const item of queue) {
        try {
          await this.syncItem(item);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          
          // Increment retry count
          item.retryCount++;
          
          // Keep item in queue if under max retry count
          if (item.retryCount < this.MAX_RETRY_COUNT) {
            failedItems.push(item);
          }
        }
      }

      // Update queue with failed items
      await AsyncStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(failedItems));
    } catch (error) {
      console.error('Error syncing pending items:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private static async syncItem(item: SyncItem): Promise<void> {
    switch (item.type) {
      case 'CREATE':
        await api.post(item.endpoint, item.data);
        break;
      case 'UPDATE':
        await api.put(item.endpoint, item.data);
        break;
      case 'DELETE':
        await api.delete(item.endpoint);
        break;
    }
  }

  // Offline data management
  static async storeOfflineData(key: string, data: any): Promise<void> {
    try {
      const offlineData = await this.getOfflineData();
      offlineData[key] = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(this.OFFLINE_DATA_KEY, JSON.stringify(offlineData));
    } catch (error) {
      console.error('Error storing offline data:', error);
    }
  }

  static async getOfflineData(): Promise<OfflineData> {
    try {
      const data = await AsyncStorage.getItem(this.OFFLINE_DATA_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting offline data:', error);
      return {};
    }
  }

  static async getOfflineItem(key: string): Promise<any> {
    try {
      const offlineData = await this.getOfflineData();
      return offlineData[key]?.data || null;
    } catch (error) {
      console.error('Error getting offline item:', error);
      return null;
    }
  }

  static async removeOfflineItem(key: string): Promise<void> {
    try {
      const offlineData = await this.getOfflineData();
      delete offlineData[key];
      await AsyncStorage.setItem(this.OFFLINE_DATA_KEY, JSON.stringify(offlineData));
    } catch (error) {
      console.error('Error removing offline item:', error);
    }
  }

  static async clearOfflineData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.OFFLINE_DATA_KEY);
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }

  // Utility methods
  static isOnlineStatus(): boolean {
    return this.isOnline;
  }

  static async getPendingItemsCount(): Promise<number> {
    const queue = await this.getSyncQueue();
    return queue.length;
  }

  static async clearSyncQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.SYNC_QUEUE_KEY);
    } catch (error) {
      console.error('Error clearing sync queue:', error);
    }
  }

  // Convenience methods for common operations
  static async createOffline(endpoint: string, data: any): Promise<void> {
    await this.addToSyncQueue({
      type: 'CREATE',
      endpoint,
      data,
    });
  }

  static async updateOffline(endpoint: string, data: any): Promise<void> {
    await this.addToSyncQueue({
      type: 'UPDATE',
      endpoint,
      data,
    });
  }

  static async deleteOffline(endpoint: string): Promise<void> {
    await this.addToSyncQueue({
      type: 'DELETE',
      endpoint,
    });
  }
} 