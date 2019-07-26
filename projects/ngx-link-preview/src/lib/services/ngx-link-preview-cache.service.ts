import { Injectable } from '@angular/core';

@Injectable()
export class NgxLinkPreviewCacheService {
   /** Holds the current cache state (RAM cache) */
   private cache = {};

   /** localStorage cache key */
   private localStorageKey = 'NgxLinkPreviewCache_q16qy4aOCzm2';

   constructor() {
      this.loadCacheFromLocalStorage();
   }

   /**
    * Try to load the cache from localstorage
    */
   private loadCacheFromLocalStorage(): void {
      try {
         this.cache = JSON.parse(localStorage.getItem(this.localStorageKey));
      } catch (e) {
         this.cache = {};
      }
   }

   /**
    * Update item in RAM cache
    */
   public updateCacheItem(cacheKey: string, data: any): void {
      if (!this.cache) {
         this.cache = {};
      }
      this.cache[cacheKey] = data;
      this.saveCache();
   }

   /**
    * Get item from cache
    */
   public getCacheItem(cacheKey: string): any {
      let cacheData;
      try {
         cacheData = this.cache[cacheKey];
      } catch (e) {
         cacheData = undefined;
      }

      if (!cacheData) {
         cacheData = undefined;
      }

      return cacheData;
   }

   /**
    * Save whole cache to localStorage
    */
   public saveCache(): void {
      try {
         localStorage.setItem(this.localStorageKey, JSON.stringify(this.cache));
      } catch (e) {
         console.warn('Failed to save OgLinkPreviewCache in localStorage!', e);
      }
   }
}
