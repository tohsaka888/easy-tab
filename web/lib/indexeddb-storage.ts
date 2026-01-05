import type { PersistStorage, StorageValue } from "zustand/middleware";

type IndexedDBOptions = {
  dbName?: string;
  storeName?: string;
};

const defaultOptions: Required<IndexedDBOptions> = {
  dbName: "easy-tab",
  storeName: "zustand",
};

function openDatabase({ dbName, storeName }: Required<IndexedDBOptions>): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) {
        request.result.createObjectStore(storeName);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  options: Required<IndexedDBOptions>,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDatabase(options);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(options.storeName, mode);
    const store = transaction.objectStore(options.storeName);
    let request: IDBRequest<T>;
    try {
      request = callback(store);
    } catch (error) {
      reject(error);
      db.close();
      return;
    }
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
    transaction.onabort = () => db.close();
  });
}

async function putValue(options: Required<IndexedDBOptions>, key: string, value: unknown) {
  const db = await openDatabase(options);
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(options.storeName, "readwrite");
    const store = transaction.objectStore(options.storeName);
    store.put(value, key);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

async function deleteValue(options: Required<IndexedDBOptions>, key: string) {
  const db = await openDatabase(options);
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(options.storeName, "readwrite");
    const store = transaction.objectStore(options.storeName);
    store.delete(key);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export function createIndexedDBStorage<T>(
  options: IndexedDBOptions = {},
): PersistStorage<T> {
  if (typeof indexedDB === "undefined") {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    } satisfies PersistStorage<T>;
  }

  const resolved = { ...defaultOptions, ...options };

  return {
    getItem: (name: string) =>
      withStore<StorageValue<T> | undefined>(resolved, "readonly", (store) => store.get(name))
        .then((value) => value ?? null)
        .catch(() => null),
    setItem: async (name: string, value: StorageValue<T>) => {
      await putValue(resolved, name, value);
    },
    removeItem: async (name: string) => {
      await deleteValue(resolved, name);
    },
  } satisfies PersistStorage<T>;
}
