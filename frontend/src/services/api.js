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

  // Strategist (AI)
  generateStrategy(prompt) {
    return this.fetch("/strategist/generate", {
      method: "POST",
      // For Phase 1 we pass a dummy user_id
      body: JSON.stringify({ user_id: "user_frontend_dev", prompt }),
    });
  }

  // Integrations (Data Sources)
  uploadDataFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    // Using native fetch directly to omit default Content-Type header so browser sets multipart boundary
    return fetch(`${this.baseUrl}/integrations/upload`, {
      method: "POST",
      body: formData,
      // headers: { 'Authorization': ... } // Add token if needed
    }).then((res) => {
      if (!res.ok) throw new Error("File upload failed");
      return res.json();
    });
  }

  connectSource(data) {
    return this.fetch("/integrations/connect", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();
