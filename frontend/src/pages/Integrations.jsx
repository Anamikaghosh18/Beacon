import { useState } from "react";
import { UploadCloud, Database, ShoppingBag, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import { useMockData } from "../hooks/useMockData";

export function Integrations() {
  const { refresh } = useMockData();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
  const [uploadMessage, setUploadMessage] = useState("");

  const [connectingSource, setConnectingSource] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({}); // { shopify: 'connected' }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);
    try {
      const res = await api.uploadDataFile(file);
      setUploadStatus("success");
      setUploadMessage(res.message);
      if (refresh) refresh();
    } catch (err) {
      setUploadStatus("error");
      setUploadMessage(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleConnect = async (sourceType) => {
    setConnectingSource(sourceType);
    try {
      const res = await api.connectSource({
        source_type: sourceType,
        credentials: { shop_name: "demo-shop", access_token: "dummy" } // Hardcoded for demo
      });
      setConnectionStatus(prev => ({ ...prev, [sourceType]: "connected" }));
    } catch (err) {
      alert("Failed to connect: " + err.message);
    } finally {
      setConnectingSource(null);
    }
  };

  return (
    <div className="space-y-8 pb-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Data Sources</h1>
        <p className="text-textSecondary mt-1 text-sm">
          Connect your existing tools or upload a file to import your customer data into Beacon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV/Excel Upload Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <UploadCloud className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-textPrimary">File Upload</h3>
              <p className="text-sm text-textSecondary mt-1">
                Upload a .csv or .xlsx with your customer data. Works for any business — SaaS, ecommerce, subscriptions.
              </p>
            </div>
          </div>

          <div className="mt-auto">
            <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl hover:bg-background/50 transition-colors cursor-pointer group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-textMuted animate-spin mb-2" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-textMuted group-hover:text-primary transition-colors mb-2" />
                )}
                <p className="text-sm text-textSecondary">
                  <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-textMuted mt-1">CSV or Excel (MAX. 10MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>

            {uploadStatus === "success" && (
              <div className="mt-4 flex items-center gap-2 text-sm text-success bg-success/10 p-3 rounded-lg border border-success/20">
                <CheckCircle2 className="w-4 h-4" />
                {uploadMessage}
              </div>
            )}
            {uploadStatus === "error" && (
              <div className="mt-4 flex items-center gap-2 text-sm text-error bg-error/10 p-3 rounded-lg border border-error/20">
                <AlertCircle className="w-4 h-4" />
                {uploadMessage}
              </div>
            )}
          </div>
        </div>

        {/* Shopify Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#95BF47]/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 text-[#95BF47]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-textPrimary">Shopify</h3>
              <p className="text-sm text-textSecondary mt-1">
                Sync your customers, orders, and products directly from your Shopify store.
              </p>
            </div>
          </div>
          
          <div className="mt-auto">
            {connectionStatus['shopify'] ? (
              <div className="flex items-center gap-2 text-sm text-success bg-success/10 p-3 rounded-lg border border-success/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Shopify connected successfully
              </div>
            ) : (
              <button 
                onClick={() => handleConnect('shopify')}
                disabled={connectingSource === 'shopify'}
                className="w-full py-2.5 px-4 bg-background border border-border rounded-lg text-sm font-medium text-textPrimary hover:bg-background/80 transition-colors flex justify-center items-center gap-2"
              >
                {connectingSource === 'shopify' && <Loader2 className="w-4 h-4 animate-spin" />}
                Connect Shopify
              </button>
            )}
          </div>
        </div>

        {/* PostgreSQL Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#336791]/10 flex items-center justify-center shrink-0">
              <Database className="w-6 h-6 text-[#336791]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-textPrimary">PostgreSQL</h3>
              <p className="text-sm text-textSecondary mt-1">
                Connect your internal database securely to sync customer records.
              </p>
            </div>
          </div>
          
          <div className="mt-auto">
            <button 
              onClick={() => handleConnect('postgres')}
              disabled={connectingSource === 'postgres' || connectionStatus['postgres']}
              className="w-full py-2.5 px-4 bg-background border border-border rounded-lg text-sm font-medium text-textPrimary hover:bg-background/80 transition-colors flex justify-center items-center gap-2"
            >
              {connectingSource === 'postgres' ? <Loader2 className="w-4 h-4 animate-spin" /> : connectionStatus['postgres'] ? "Connected" : "Connect Database"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
