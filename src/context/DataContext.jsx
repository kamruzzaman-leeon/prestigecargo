import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  defaultCompanyData,
  defaultHeroSlidesData,
  defaultIndustriesData,
  defaultServicesData,
  defaultTradeLanesData,
  defaultTrackingData
} from '../data/defaultSiteData';

const DataContext = createContext(null);

const STORAGE_KEYS = {
  companyData: 'prestige_company_data',
  heroSlidesData: 'prestige_hero_slides_data',
  industriesData: 'prestige_industries_data',
  servicesData: 'prestige_services_data',
  tradeLanesData: 'prestige_trade_lanes_data',
  trackingData: 'prestige_tracking_data',
  inquiriesData: 'prestige_inquiries_data'
};

function getLocalOrFallback(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function setLocalSafe(key, val) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage`, e);
  }
}

export function DataProvider({ children }) {
  const [companyInfo, setCompanyInfo] = useState(() => getLocalOrFallback(STORAGE_KEYS.companyData, defaultCompanyData));
  const [heroSlides, setHeroSlides] = useState(() => getLocalOrFallback(STORAGE_KEYS.heroSlidesData, defaultHeroSlidesData));
  const [industriesList, setIndustriesList] = useState(() => getLocalOrFallback(STORAGE_KEYS.industriesData, defaultIndustriesData));
  const [servicesList, setServicesList] = useState(() => getLocalOrFallback(STORAGE_KEYS.servicesData, defaultServicesData));
  const [tradeLanes, setTradeLanes] = useState(() => getLocalOrFallback(STORAGE_KEYS.tradeLanesData, defaultTradeLanesData));
  const [trackingData, setTrackingData] = useState(() => getLocalOrFallback(STORAGE_KEYS.trackingData, defaultTrackingData));
  const [inquiriesList, setInquiriesList] = useState(() => getLocalOrFallback(STORAGE_KEYS.inquiriesData, []));
  const [isLoading, setIsLoading] = useState(false);

  // Sync data with backend API (/api/data)
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.companyData) {
          setCompanyInfo(json.data.companyData);
          setLocalSafe(STORAGE_KEYS.companyData, json.data.companyData);
        }
        if (json.data.heroSlidesData) {
          setHeroSlides(json.data.heroSlidesData);
          setLocalSafe(STORAGE_KEYS.heroSlidesData, json.data.heroSlidesData);
        }
        if (json.data.industriesData) {
          setIndustriesList(json.data.industriesData);
          setLocalSafe(STORAGE_KEYS.industriesData, json.data.industriesData);
        }
        if (json.data.servicesData) {
          setServicesList(json.data.servicesData);
          setLocalSafe(STORAGE_KEYS.servicesData, json.data.servicesData);
        }
        if (json.data.tradeLanesData) {
          setTradeLanes(json.data.tradeLanesData);
          setLocalSafe(STORAGE_KEYS.tradeLanesData, json.data.tradeLanesData);
        }
        if (json.data.trackingData) {
          setTrackingData(json.data.trackingData);
          setLocalSafe(STORAGE_KEYS.trackingData, json.data.trackingData);
        }
        if (json.data.inquiriesData) {
          setInquiriesList(json.data.inquiriesData);
          setLocalSafe(STORAGE_KEYS.inquiriesData, json.data.inquiriesData);
        }
      }
    } catch (err) {
      // Backend may be offline or static dev; localStorage state remains active
      console.info('Backend API data sync info:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch from server on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Save handler for a specific category
  const saveData = async (category, newData) => {
    try {
      setIsLoading(true);

      // 1. Optimistic React State update & LocalStorage persistence
      if (category === 'companyData') {
        setCompanyInfo(newData);
        setLocalSafe(STORAGE_KEYS.companyData, newData);
      } else if (category === 'heroSlidesData') {
        setHeroSlides(newData);
        setLocalSafe(STORAGE_KEYS.heroSlidesData, newData);
      } else if (category === 'industriesData') {
        setIndustriesList(newData);
        setLocalSafe(STORAGE_KEYS.industriesData, newData);
      } else if (category === 'servicesData') {
        setServicesList(newData);
        setLocalSafe(STORAGE_KEYS.servicesData, newData);
      } else if (category === 'tradeLanesData') {
        setTradeLanes(newData);
        setLocalSafe(STORAGE_KEYS.tradeLanesData, newData);
      } else if (category === 'trackingData') {
        setTrackingData(newData);
        setLocalSafe(STORAGE_KEYS.trackingData, newData);
      } else if (category === 'inquiriesData') {
        setInquiriesList(newData);
        setLocalSafe(STORAGE_KEYS.inquiriesData, newData);
      }

      // 2. Persist to Express Backend API if available
      try {
        const res = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, data: newData })
        });
        if (res.ok) {
          const json = await res.json();
          return json.success !== false;
        }
      } catch (networkErr) {
        console.warn('API post error (persisted to localStorage):', networkErr);
      }

      return true;
    } catch (err) {
      console.error(`Failed to update ${category}:`, err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addInquiry = (inquiry) => {
    const updated = [
      {
        id: `inq-${Date.now()}`,
        date: new Date().toISOString(),
        ...inquiry
      },
      ...inquiriesList
    ];
    setInquiriesList(updated);
    setLocalSafe(STORAGE_KEYS.inquiriesData, updated);
  };

  return (
    <DataContext.Provider
      value={{
        companyInfo,
        heroSlides,
        industriesList,
        servicesList,
        tradeLanes,
        trackingData,
        inquiriesList,
        isLoading,
        refreshData,
        saveData,
        addInquiry
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
}
