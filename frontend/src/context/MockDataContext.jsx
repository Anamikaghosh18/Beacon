import { createContext, useState, useEffect } from 'react';
import * as mockData from '../data/mockData';
import { api } from '../services/api';

export const MockDataContext = createContext();

const BLANK_STATE = {
  kpis: {
    total_customers: 0,
    active_segments: 0,
    campaigns_sent: 0,
    revenue_influenced: 0
  },
  funnel: [],
  segments: [],
  campaigns: [],
  EVENT_STREAM: [], // Event stream is empty initially
  // Kept for backward compatibility if any old components still need it
  MOCK_KPIS: { totalCustomers: 0, activeSegments: 0, campaignsSent: 0, revenueInfluenced: 0 },
  CAMPAIGN_FUNNEL: [],
  RECENT_CAMPAIGNS: [],
  SEGMENTS: [],
  AI_INSIGHTS: [] // No AI insights until there's data
};

export function MockDataProvider({ children }) {
  const [data, setData] = useState(BLANK_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchLiveBackend() {
      try {
        console.log("Attempting to connect to live backend...");
        // Fetch all necessary data
        const [kpis, funnel, segmentsRes, campaignsRes] = await Promise.all([
          api.getKPIs(),
          api.getFunnel(),
          api.getSegments(),
          api.getCampaigns()
        ]);

        setData({
          ...BLANK_STATE,
          kpis,
          funnel: funnel.funnel || [],
          segments: segmentsRes.items || [],
          campaigns: campaignsRes.items || []
        });
        setIsLive(true);
        console.log("Successfully connected to live backend!");
      } catch (error) {
        console.warn("Live backend not detected or failed. Staying with blank slate.", error);
        setIsLive(false);
        // Keep the blank state
      } finally {
        setIsLoading(false);
      }
    }

    fetchLiveBackend();
  }, []);

  return (
    <MockDataContext.Provider value={{ data, setData, isLoading, isLive }}>
      {children}
    </MockDataContext.Provider>
  );
}
