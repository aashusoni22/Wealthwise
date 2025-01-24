import authService from "../appwrite/auth";
import { showToast } from "../components/Toast";

class SecurityService {
  // Store for recent activities
  recentActivities = new Map();
  // Store for device information
  knownDevices = new Set();

  constructor() {
    this.initializeSecurityMonitoring();
  }

  async initializeSecurityMonitoring() {
    // Get current device info
    const deviceInfo = this.getDeviceInfo();
    this.knownDevices.add(JSON.stringify(deviceInfo));

    // Start monitoring
    this.monitorUserActivity();
    this.monitorLocationChanges();
    this.monitorDeviceChanges();
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  monitorUserActivity() {
    // Monitor login attempts
    document.addEventListener("login-attempt", (event) => {
      const { success, email, location } = event.detail;
      this.logActivity({
        type: "login",
        success,
        email,
        location,
        timestamp: new Date(),
      });
    });

    // Monitor password changes
    document.addEventListener("password-change", (event) => {
      this.logActivity({
        type: "password-change",
        timestamp: new Date(),
      });
      this.sendSecurityAlert(
        "Password Changed",
        "Your password was recently changed."
      );
    });
  }

  monitorLocationChanges() {
    // Get user's location periodically
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Check if location is significantly different from usual
        this.checkUnusualLocation(currentLocation);
      });
    }
  }

  monitorDeviceChanges() {
    const currentDevice = this.getDeviceInfo();
    const deviceString = JSON.stringify(currentDevice);

    if (!this.knownDevices.has(deviceString)) {
      this.sendSecurityAlert(
        "New Device Login",
        "Your account was accessed from a new device."
      );
      this.knownDevices.add(deviceString);
    }
  }

  async checkUnusualLocation(location) {
    // Implement location checking logic
    // This is a simplified example
    const recentLocations = Array.from(this.recentActivities.values())
      .filter((activity) => activity.location)
      .slice(-5);

    if (recentLocations.length > 0) {
      const isUnusual = this.isLocationUnusual(location, recentLocations);
      if (isUnusual) {
        this.sendSecurityAlert(
          "Unusual Location",
          "Your account was accessed from an unusual location."
        );
      }
    }
  }

  isLocationUnusual(currentLocation, recentLocations) {
    // Simplified location check
    // In a real app, you'd want more sophisticated location comparison
    return recentLocations.every((recent) => {
      const distance = this.calculateDistance(currentLocation, recent.location);
      return distance > 100; // More than 100km is considered unusual
    });
  }

  calculateDistance(loc1, loc2) {
    // Haversine formula for calculating distance between coordinates
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(loc2.lat - loc1.lat);
    const dLon = this.toRad(loc2.lng - loc1.lng);
    const lat1 = this.toRad(loc1.lat);
    const lat2 = this.toRad(loc2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(value) {
    return (value * Math.PI) / 180;
  }

  logActivity(activity) {
    const userId = authService.getCurrentUserId();
    if (!userId) return;

    const userActivities = this.recentActivities.get(userId) || [];
    userActivities.push(activity);
    this.recentActivities.set(userId, userActivities.slice(-10)); // Keep last 10 activities
  }

  async sendSecurityAlert(title, message) {
    // Show toast notification
    showToast(message, "warning");

    // You could also implement email notifications here
    // For now, we'll just log to console
    console.log("Security Alert:", title, message);
  }

  // Function to check for suspicious patterns
  checkSuspiciousPatterns() {
    const userId = authService.getCurrentUserId();
    if (!userId) return;

    const userActivities = this.recentActivities.get(userId) || [];

    // Check for rapid-fire login attempts
    const recentLogins = userActivities
      .filter((activity) => activity.type === "login")
      .slice(-3);

    if (recentLogins.length >= 3) {
      const timeDiff =
        recentLogins[recentLogins.length - 1].timestamp -
        recentLogins[0].timestamp;
      if (timeDiff < 60000) {
        // Less than 1 minute
        this.sendSecurityAlert(
          "Suspicious Activity",
          "Multiple rapid login attempts detected."
        );
      }
    }
  }
}

export const securityService = new SecurityService();
