import React, { createContext, useContext, useState } from 'react';

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  address: string;
}

interface LocationContextType {
  location: LocationData;
  setLocation: (data: LocationData) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: any) => {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    address: 'Choose Location',
  });

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used inside LocationProvider');
  return context;
};
