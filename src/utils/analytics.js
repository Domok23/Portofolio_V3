import { db, addDoc, collection } from "../firebase";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";
import { app } from "../firebase";

let firebaseAnalytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
      try {
        firebaseAnalytics = getAnalytics(app);
      } catch (e) {
        console.debug("Firebase Analytics not initialized:", e);
      }
    }
  });
}

// Generate or retrieve persistent visitor UUID
export const getVisitorId = () => {
  try {
    let vid = localStorage.getItem("pf_visitor_id");
    if (!vid) {
      vid = "v_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("pf_visitor_id", vid);
    }
    return vid;
  } catch {
    return "anonymous";
  }
};

// Generate or retrieve current session ID (resets when tab/session closes)
export const getSessionId = () => {
  try {
    let sid = sessionStorage.getItem("pf_session_id");
    if (!sid) {
      sid = "s_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 7);
      sessionStorage.setItem("pf_session_id", sid);
    }
    return sid;
  } catch {
    return "session_temp";
  }
};

// Device & Browser detector
export const detectDevice = () => {
  if (typeof window === "undefined") {
    return { type: "Desktop", browser: "Unknown", os: "Unknown" };
  }

  const ua = navigator.userAgent || "";
  let type = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    type = "Tablet";
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    type = "Mobile";
  } else if (window.innerWidth <= 768) {
    type = "Mobile";
  }

  let browser = "Other";
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/") && !ua.includes("Edg/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";
  else if (ua.includes("OPR/") || ua.includes("Opera/")) browser = "Opera";

  let os = "Other";
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("like Mac")) os = "iOS";

  return { type, browser, os };
};

// Fast, non-blocking Geo Location detection with Session caching
export const getGeoLocation = async () => {
  try {
    const cached = sessionStorage.getItem("pf_geo_location");
    if (cached) {
      return JSON.parse(cached);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("https://ipwho.is/", { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        const geoInfo = {
          country: data.country || "Unknown",
          countryCode: data.country_code || "",
          city: data.city || "Unknown",
          flag: data.flag?.emoji || "🌐",
          ip: data.ip || "",
        };
        sessionStorage.setItem("pf_geo_location", JSON.stringify(geoInfo));
        return geoInfo;
      }
    }
  } catch {
    // Network offline, timeout, or blocked by adblock
  }

  return {
    country: "Unknown",
    countryCode: "",
    city: "Unknown",
    flag: "🌐",
  };
};

// Main function to track page views
export const trackPageView = async (path, title) => {
  if (typeof window === "undefined") return;

  // Ignore admin page visits or if admin is logged in
  const isAuthUser = !!localStorage.getItem("user");
  const normalizedPath = path || window.location.hash || window.location.pathname;
  if (isAuthUser || normalizedPath.includes("admin") || normalizedPath.includes("login")) {
    return;
  }

  // Throttling: avoid duplicate tracking within 15 seconds on identical path
  try {
    const lastTracked = sessionStorage.getItem("pf_last_tracked_path");
    const lastTime = Number(sessionStorage.getItem("pf_last_tracked_time") || 0);
    const now = Date.now();

    if (lastTracked === normalizedPath && now - lastTime < 15000) {
      return;
    }

    sessionStorage.setItem("pf_last_tracked_path", normalizedPath);
    sessionStorage.setItem("pf_last_tracked_time", now.toString());
  } catch {
    // Session storage not accessible
  }

  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  const device = detectDevice();
  const geo = await getGeoLocation();
  const pageTitle = title || document.title || "Portfolio";
  const referrer = document.referrer ? new URL(document.referrer, window.location.origin).hostname : "Direct";

  const now = new Date();
  const dateString = now.toISOString().split("T")[0]; // YYYY-MM-DD

  // 1. Log to Firestore
  try {
    await addDoc(collection(db, "visitor_logs"), {
      visitorId,
      sessionId,
      path: normalizedPath,
      pageTitle,
      referrer,
      device: device.type,
      browser: device.browser,
      os: device.os,
      screen: `${window.screen.width}x${window.screen.height}`,
      country: geo.country,
      countryCode: geo.countryCode,
      city: geo.city,
      flag: geo.flag,
      timestamp: now,
      dateString,
    });
  } catch (err) {
    console.debug("Analytics log error:", err);
  }

  // 2. Log to Google Analytics 4 (if available)
  try {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: normalizedPath,
        page_title: pageTitle,
      });
    }
  } catch {}

  // 3. Log to Firebase Analytics (if initialized)
  try {
    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, "page_view", {
        page_path: normalizedPath,
        page_title: pageTitle,
      });
    }
  } catch {}
};

// Track custom user interactions (e.g. clicking Project Demo, downloading CV, clicking GitHub)
export const trackEvent = async (eventName, params = {}) => {
  if (typeof window === "undefined") return;

  const isAuthUser = !!localStorage.getItem("user");
  if (isAuthUser) return;

  try {
    // GA4
    if (window.gtag) {
      window.gtag("event", eventName, params);
    }
    // Firebase
    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, eventName, params);
    }
  } catch {}
};
