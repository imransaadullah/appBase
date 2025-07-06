import { MMKV } from 'react-native-mmkv';

class StorageService {
  private storage: MMKV;

  constructor() {
    this.storage = new MMKV();
  }

  // String methods
  set(key: string, value: string): void {
    this.storage.set(key, value);
  }

  getString(key: string): string | undefined {
    return this.storage.getString(key);
  }

  // Object methods
  setObject(key: string, value: object): void {
    this.storage.set(key, JSON.stringify(value));
  }

  getObject<T>(key: string): T | null {
    const value = this.storage.getString(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return null;
      }
    }
    return null;
  }

  // Boolean methods
  setBoolean(key: string, value: boolean): void {
    this.storage.set(key, value);
  }

  getBoolean(key: string): boolean | undefined {
    return this.storage.getBoolean(key);
  }

  // Number methods
  setNumber(key: string, value: number): void {
    this.storage.set(key, value);
  }

  getNumber(key: string): number | undefined {
    return this.storage.getNumber(key);
  }

  // Utility methods
  delete(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clearAll();
  }

  getAllKeys(): string[] {
    return this.storage.getAllKeys();
  }

  contains(key: string): boolean {
    return this.storage.contains(key);
  }
}

export const storage = new StorageService(); 