import { createContext, useState, useEffect, useCallback } from 'react';
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
  EVENT_STREAM: [],
  MOCK_KPIS: { totalCustomers: 0, activeSegments: 0, campaignsSent: 0, revenueInfluenced: 0 },
  CAMPAIGN_FUNNEL: [],
  RECENT_CAMPAIGNS: [],
  SEGMENTS: [],
  AI_INSIGHTS: []
};

async function enrichCampaigns(campaigns) {
  return Promise.all(
    campaigns.map(async (c) => {
      if (c.status === 'draft') return { ...c, metrics: null };
      try {
        const metrics = await api.getCampaignMetrics(c.id);
        return { ...c, metrics };
      } catch {
        return { ...c, metrics: null };
      }
    })
  );
}

export function MockDataProvider({ children }) {
  const [data, setData] = useState(BLANK_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [kpis, funnel, segmentsRes, campaignsRes, eventsRes] = await Promise.all([
        api.getKPIs(),
        api.getFunnel(),
        api.getSegments(),
        api.getCampaigns(),
        api.getEvents(50),
      ]);

      const campaigns = await enrichCampaigns(campaignsRes.items || []);

      setData({
        ...BLANK_STATE,
        kpis,
        funnel: funnel.funnel || [],
        segments: segmentsRes.items || [],
        campaigns,
        EVENT_STREAM: eventsRes.items || [],
      });
      setIsLive(true);
    } catch (error) {
      console.warn("Live backend not available:", error);
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <MockDataContext.Provider value={{ data, setData, isLoading, isLive, refresh }}>
      {children}
    </MockDataContext.Provider>
  );
}
