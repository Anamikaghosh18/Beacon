const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

class ApiService {
  constructor() {
    this.baseUrl = API_URL;
  }

  async fetch(endpoint, options = {}) {
    let token = null;

    if (typeof window !== "undefined" && window.Clerk?.session?.getToken) {
      try {
        token = await window.Clerk.session.getToken();
      } catch (error) {
        console.warn("Unable to get Clerk token:", error);
      }
    }

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "API Request Failed");
    }

    return response.json();
  }

  // Dashboard
  getKPIs() {
    return this.fetch("/dashboard/kpis");
  }

  getFunnel() {
    return this.fetch("/dashboard/funnel");
  }

  // Segments
  getSegments() {
    return this.fetch("/segments");
  }

  createSegment(data) {
    return this.fetch("/segments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Campaigns
  getCampaigns() {
    return this.fetch("/campaigns");
  }

  getCampaign(id) {
    return this.fetch(`/campaigns/${id}`);
  }

  createCampaign(data) {
    return this.fetch("/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  launchCampaign(id) {
    return this.fetch(`/campaigns/${id}/launch`, {
      method: "POST",
    });
  }

  getCampaignMetrics(id) {
    return this.fetch(`/campaigns/${id}/metrics`);
  }

  getCampaignTimeline(id) {
    return this.fetch(`/campaigns/${id}/timeline`);
  }

  getEvents(limit = 50) {
    return this.fetch(`/events?limit=${limit}`);
  }

  // Strategist (AI)
  generateStrategy(prompt) {
    return this.fetch("/strategist/generate", {
      method: "POST",
      // For Phase 1 we pass a dummy user_id
      body: JSON.stringify({ user_id: "user_frontend_dev", prompt }),
    });
  }

  // Integrations (Data Sources)
  async uploadDataFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const headers = {};

    // Attempt to get Clerk token
    if (typeof window !== "undefined" && window.Clerk?.session?.getToken) {
      try {
        const token = await window.Clerk.session.getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.warn("Unable to get Clerk token for upload:", error);
      }
    }

    // Using native fetch directly to omit default Content-Type header so browser sets multipart boundary
    const res = await fetch(`${this.baseUrl}/integrations/upload`, {
      method: "POST",
      body: formData,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed: HTTP ${res.status}`);
    }

    return res.json();
  }

  connectSource(data) {
    return this.fetch("/integrations/connect", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();
