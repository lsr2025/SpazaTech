// Offline Storage Utility using IndexedDB
const DB_NAME = 'SpazaOfflineDB';
const DB_VERSION = 1;
const STORES = {
  SHOPS: 'pending_shops',
  INSPECTIONS: 'pending_inspections',
  PHOTOS: 'pending_photos'
};

class OfflineStorage {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(STORES.SHOPS)) {
          const shopStore = db.createObjectStore(STORES.SHOPS, { keyPath: 'id', autoIncrement: true });
          shopStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.INSPECTIONS)) {
          const inspectionStore = db.createObjectStore(STORES.INSPECTIONS, { keyPath: 'id', autoIncrement: true });
          inspectionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.PHOTOS)) {
          const photoStore = db.createObjectStore(STORES.PHOTOS, { keyPath: 'id', autoIncrement: true });
          photoStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveShop(shopData) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.SHOPS], 'readwrite');
      const store = transaction.objectStore(STORES.SHOPS);
      
      const data = {
        ...shopData,
        timestamp: new Date().toISOString(),
        synced: false
      };

      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveInspection(inspectionData) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.INSPECTIONS], 'readwrite');
      const store = transaction.objectStore(STORES.INSPECTIONS);
      
      const data = {
        ...inspectionData,
        timestamp: new Date().toISOString(),
        synced: false
      };

      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingShops() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.SHOPS], 'readonly');
      const store = transaction.objectStore(STORES.SHOPS);
      const request = store.getAll();

      request.onsuccess = () => {
        const all = request.result;
        resolve(all.filter(item => !item.synced));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingInspections() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.INSPECTIONS], 'readonly');
      const store = transaction.objectStore(STORES.INSPECTIONS);
      const request = store.getAll();

      request.onsuccess = () => {
        const all = request.result;
        resolve(all.filter(item => !item.synced));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async markAsSynced(storeName, id) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.synced = true;
          const updateRequest = store.put(data);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteSynced(storeName, id) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPendingCount() {
    const shops = await this.getPendingShops();
    const inspections = await this.getPendingInspections();
    return shops.length + inspections.length;
  }
}

export const offlineStorage = new OfflineStorage();
export { STORES };