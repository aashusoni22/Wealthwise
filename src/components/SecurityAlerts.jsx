import React, { useState, useEffect } from "react";
import { Bell, Shield } from "lucide-react";
import { securityService } from "../services/securityService";

const SecurityAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    // Subscribe to security alerts
    const handleSecurityAlert = (event) => {
      setAlerts((prev) => [...prev, event.detail]);
    };

    document.addEventListener("security-alert", handleSecurityAlert);
    return () =>
      document.removeEventListener("security-alert", handleSecurityAlert);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowAlerts(!showAlerts)}
        className="relative p-2 text-surface-400 hover:text-surface-100 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {alerts.length > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {showAlerts && (
        <div className="absolute right-0 mt-2 w-80 bg-surface-800 rounded-lg shadow-lg border border-surface-700">
          <div className="p-3 border-b border-surface-700">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-500" />
              <h3 className="font-medium text-surface-100">Security Alerts</h3>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-surface-400">
                No security alerts
              </div>
            ) : (
              alerts.map((alert, index) => (
                <div
                  key={index}
                  className="p-3 border-b border-surface-700 last:border-0"
                >
                  <h4 className="font-medium text-surface-100">
                    {alert.title}
                  </h4>
                  <p className="text-sm text-surface-400">{alert.message}</p>
                  <span className="text-xs text-surface-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAlerts;
