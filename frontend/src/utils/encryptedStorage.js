/**
 * Encrypted IndexedDB Storage Utility
 * Uses Web Crypto API for AES-GCM encryption
 * Stores user data securely in IndexedDB
 */

const DB_NAME = 'cpcoders_secure_db';
const DB_VERSION = 1;
const STORE_NAME = 'encrypted_data';
const ENCRYPTION_KEY_NAME = 'cpcoders_encryption_key';

class EncryptedStorage {
  constructor() {
    this.db = null;
    this.cryptoKey = null;
  }

  // Initialize the database and encryption key
  async init() {
    if (this.db && this.cryptoKey) return;
    
    await this.openDatabase();
    await this.getOrCreateEncryptionKey();
  }

  // Open IndexedDB database
  openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
    });
  }

  // Generate or retrieve encryption key using Web Crypto API
  async getOrCreateEncryptionKey() {
    // Try to get existing key from sessionStorage (persists only during session)
    const storedKey = sessionStorage.getItem(ENCRYPTION_KEY_NAME);
    
    if (storedKey) {
      const keyData = JSON.parse(storedKey);
      this.cryptoKey = await crypto.subtle.importKey(
        'jwk',
        keyData,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    } else {
      // Generate new encryption key
      this.cryptoKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      
      // Export and store in sessionStorage
      const exportedKey = await crypto.subtle.exportKey('jwk', this.cryptoKey);
      sessionStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(exportedKey));
    }
  }

  // Encrypt data using AES-GCM
  async encrypt(data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));
    
    // Generate random IV for each encryption
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.cryptoKey,
      encodedData
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  }

  // Decrypt data using AES-GCM
  async decrypt(encryptedString) {
    try {
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedString).split('').map(c => c.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encryptedData = combined.slice(12);

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        this.cryptoKey,
        encryptedData
      );

      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decryptedData));
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Store encrypted data in IndexedDB
  async setItem(key, value) {
    await this.init();
    
    const encryptedValue = await this.encrypt(value);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ key, value: encryptedValue });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Retrieve and decrypt data from IndexedDB
  async getItem(key) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        if (request.result) {
          const decrypted = await this.decrypt(request.result.value);
          resolve(decrypted);
        } else {
          resolve(null);
        }
      };
    });
  }

  // Remove item from IndexedDB
  async removeItem(key) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Clear all encrypted data
  async clear() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // Also clear encryption key from sessionStorage
        sessionStorage.removeItem(ENCRYPTION_KEY_NAME);
        this.cryptoKey = null;
        resolve();
      };
    });
  }

  // Check if storage is available
  static isSupported() {
    return (
      typeof indexedDB !== 'undefined' &&
      typeof crypto !== 'undefined' &&
      typeof crypto.subtle !== 'undefined'
    );
  }
}

// Singleton instance
const encryptedStorage = new EncryptedStorage();

// Storage keys for user data
export const STORAGE_KEYS = {
  USER_DATA: 'userData',
  USER_PREFERENCES: 'userPreferences'
};

export default encryptedStorage;
