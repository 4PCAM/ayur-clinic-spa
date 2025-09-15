// Local Storage Management for 4-PCAM

class StorageManager {
  static prefix = '4pcam_';
  
  // Get item from localStorage with error handling
  static getItem(key) {
    try {
      const fullKey = this.prefix + key;
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  }
  
  // Set item in localStorage with error handling
  static setItem(key, value) {
    try {
      const fullKey = this.prefix + key;
      localStorage.setItem(fullKey, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded();
      }
      return false;
    }
  }
  
  // Remove item from localStorage
  static removeItem(key) {
    try {
      const fullKey = this.prefix + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
      return false;
    }
  }
  
  // Clear all 4-PCAM data from localStorage
  static clearAll() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
  
  // Get all 4-PCAM data
  static getAllData() {
    const data = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          const cleanKey = key.replace(this.prefix, '');
          data[cleanKey] = this.getItem(cleanKey);
        }
      }
      return data;
    } catch (error) {
      console.error('Error getting all data from localStorage:', error);
      return {};
    }
  }
  
  // Check if localStorage is available
  static isAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Get storage usage information
  static getStorageInfo() {
    if (!this.isAvailable()) {
      return null;
    }
    
    let totalSize = 0;
    let fourPCAMSize = 0;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          const size = key.length + (value ? value.length : 0);
          totalSize += size;
          
          if (key.startsWith(this.prefix)) {
            fourPCAMSize += size;
          }
        }
      }
      
      return {
        totalSize: totalSize,
        fourPCAMSize: fourPCAMSize,
        totalSizeKB: Math.round(totalSize / 1024 * 100) / 100,
        fourPCAMSizeKB: Math.round(fourPCAMSize / 1024 * 100) / 100
      };
    } catch (error) {
      console.error('Error calculating storage info:', error);
      return null;
    }
  }
  
  // Handle quota exceeded error
  static handleQuotaExceeded() {
    console.warn('localStorage quota exceeded. Attempting to free up space...');
    
    // Strategy: Remove oldest auto-save data
    try {
      const oldDataKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix) && key.includes('_autosave_')) {
          oldDataKeys.push(key);
        }
      }
      
      // Sort by timestamp and remove oldest
      oldDataKeys.sort().slice(0, Math.ceil(oldDataKeys.length / 2)).forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log(`Removed ${oldDataKeys.length} old auto-save entries`);
    } catch (error) {
      console.error('Error handling quota exceeded:', error);
    }
  }
  
  // Create backup of all data
  static createBackup() {
    const data = this.getAllData();
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: data
    };
    
    return JSON.stringify(backup, null, 2);
  }
  
  // Restore from backup
  static restoreBackup(backupString) {
    try {
      const backup = JSON.parse(backupString);
      
      if (!backup.data) {
        throw new Error('Invalid backup format');
      }
      
      // Clear existing data
      this.clearAll();
      
      // Restore data
      Object.keys(backup.data).forEach(key => {
        this.setItem(key, backup.data[key]);
      });
      
      return true;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }
  
  // Auto-save with timestamp
  static autoSave(key, data) {
    const timestamp = new Date().toISOString();
    const autoSaveKey = `${key}_autosave_${timestamp}`;
    return this.setItem(autoSaveKey, data);
  }
  
  // Get latest auto-save
  static getLatestAutoSave(key) {
    const autoSaveKeys = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (storageKey && storageKey.startsWith(this.prefix + key + '_autosave_')) {
          autoSaveKeys.push(storageKey);
        }
      }
      
      if (autoSaveKeys.length === 0) {
        return null;
      }
      
      // Sort by timestamp (latest first)
      autoSaveKeys.sort().reverse();
      const latestKey = autoSaveKeys[0].replace(this.prefix, '');
      
      return this.getItem(latestKey);
    } catch (error) {
      console.error('Error getting latest auto-save:', error);
      return null;
    }
  }
}