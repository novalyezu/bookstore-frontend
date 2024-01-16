const getLocalStorageItem = (key: string): any => {
  if (typeof window !== "undefined") {
    const itemValue = window.localStorage.getItem(key);
    if (itemValue) {
      const decodedValue = atob(itemValue);
      try {
        return JSON.parse(decodedValue);
      } catch {
        return decodedValue;
      }
    }
  }
  return null;
};

const setLocalStorageItem = <T>(key: string, value: T) => {
  if (typeof window !== "undefined") {
    const stringfiedValue = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, btoa(stringfiedValue));
  }
};

const removeLocalStorageItem = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

const clearLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
};

const storage = {
  getItem: getLocalStorageItem,
  setItem: setLocalStorageItem,
  removeItem: removeLocalStorageItem,
  clear: clearLocalStorage,
};

export default storage;