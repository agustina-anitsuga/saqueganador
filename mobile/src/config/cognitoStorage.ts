import AsyncStorage from '@react-native-async-storage/async-storage';

// amazon-cognito-identity-js expects a synchronous localStorage-like Storage.
// React Native has none, so we keep an in-memory map (sync reads/writes) and
// mirror it to AsyncStorage so sessions survive app restarts.
class SyncCognitoStorage {
  private data: Record<string, string> = {};

  setItem(key: string, value: string): string {
    this.data[key] = value;
    AsyncStorage.setItem(key, value).catch(() => {});
    return value;
  }

  getItem(key: string): string | null {
    return key in this.data ? this.data[key] : null;
  }

  removeItem(key: string): void {
    delete this.data[key];
    AsyncStorage.removeItem(key).catch(() => {});
  }

  clear(): void {
    const keys = Object.keys(this.data);
    this.data = {};
    keys.forEach((k) => AsyncStorage.removeItem(k).catch(() => {}));
  }

  // Load previously-persisted Cognito keys into memory before first use.
  async hydrate(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cognitoKeys = keys.filter((k) => k.startsWith('CognitoIdentityServiceProvider'));
      if (cognitoKeys.length === 0) return;
      const entries = await AsyncStorage.multiGet(cognitoKeys);
      entries.forEach(([k, v]) => {
        if (v != null) this.data[k] = v;
      });
    } catch {
      // ignore hydration failures — worst case the user re-logs in
    }
  }
}

export const cognitoStorage = new SyncCognitoStorage();
