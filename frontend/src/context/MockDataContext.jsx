import { createContext, useState } from 'react';
import * as mockData from '../data/mockData';

export const MockDataContext = createContext();

export function MockDataProvider({ children }) {
  const [data, setData] = useState(mockData);

  // In a real app, we'd have functions here to mutate data
  // For now we just expose the static mock data.

  return (
    <MockDataContext.Provider value={{ data, setData }}>
      {children}
    </MockDataContext.Provider>
  );
}
