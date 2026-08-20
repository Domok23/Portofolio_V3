import React, { useState, useEffect, useMemo } from "react";
import {
  db,
  collection,
  getDocs,
} from "../../firebase";
import {
  BarChart3,
  Users,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Globe2,
  Calendar,
  Clock,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  Compass,
  Layers,
  MapPin,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";
import Swal from "sweetalert2";

const AnalyticsTab = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d"); // "today" | "7d" | "30d" | "all"
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setIsRefreshing(true);
      const snapshot = await getDocs(collection(db, "visitor_logs"));
      const rawData = snapshot.docs.map((doc) => {
        const data = doc.data();
        let timestampMs = 0;
        if (data.timestamp) {
          if (typeof data.timestamp.toDate === "function") {
            timestampMs = data.timestamp.toDate().getTime();
          } else if (data.timestamp instanceof Date) {
            timestampMs = data.timestamp.getTime();
          } else {
            timestampMs = new Date(data.timestamp).getTime();
          }
        }
        return {
          id: doc.id,
          ...data,
          timestampMs: isNaN(timestampMs) ? Date.now() : timestampMs,
        };
      });

      // Sort descending by time
      rawData.sort((a, b) => b.timestampMs - a.timestampMs);
      setLogs(rawData);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Filter logs by selected time range
  const filteredLogs = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    let cutoff = 0;
    if (timeRange === "today") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      cutoff = startOfDay.getTime();
    } else if (timeRange === "7d") {
      cutoff = now - 7 * oneDay;
    } else if (timeRange === "30d") {
      cutoff = now - 30 * oneDay;
    }

    return logs.filter((log) => log.timestampMs >= cutoff);
  }, [logs, timeRange]);

  // Search filtered logs for the table
  const searchFilteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return filteredLogs;
    const term = searchTerm.toLowerCase();
    return filteredLogs.filter(
      (log) =>
        (log.path || "").toLowerCase().includes(term) ||
        (log.pageTitle || "").toLowerCase().includes(term) ||
        (log.city || "").toLowerCase().includes(term) ||
        (log.country || "").toLowerCase().includes(term) ||
        (log.browser || "").toLowerCase().includes(term) ||
        (log.device || "").toLowerCase().includes(term)
    );
  }, [filteredLogs, searchTerm]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const totalViews = filteredLogs.length;
    const uniqueVisitors = new Set(filteredLogs.map((l) => l.visitorId || l.id)).size;
    const totalSessions = new Set(filteredLogs.map((l) => l.sessionId || l.id)).size;

    // Today's view count
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayViews = logs.filter((l) => l.timestampMs >= startOfToday.getTime()).length;

    // Devices count
    const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
    filteredLogs.forEach((l) => {
      const d = l.device || "Desktop";
      if (devices[d] !== undefined) devices[d]++;
      else devices.Desktop++;
    });

    // Top Pages
    const pageMap = {};
    filteredLogs.forEach((l) => {
      const key = l.path || "/";
      pageMap[key] = (pageMap[key] || 0) + 1;
    });
    const topPages = Object.entries(pageMap)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Top Countries
    const countryMap = {};
    filteredLogs.forEach((l) => {
      const country = l.country || "Unknown";
      const flag = l.flag || "🌐";
      const key = `${flag} ${country}`;
      countryMap[key] = (countryMap[key] || 0) + 1;
    });
    const topCountries = Object.entries(countryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top Referrers
    const refMap = {};
    filteredLogs.forEach((l) => {
      const ref = l.referrer || "Direct";
      refMap[ref] = (refMap[ref] || 0) + 1;
    });
    const topReferrers = Object.entries(refMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Daily views trend for Chart (Last 7 or 14 days)
    const daysCount = timeRange === "today" ? 1 : timeRange === "30d" ? 14 : 7;
    const dailyChartData = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      const count = logs.filter((l) => {
        const lDate = new Date(l.timestampMs).toISOString().split("T")[0];
        return lDate === dateStr;
      }).length;

      dailyChartData.push({ date: dateStr, label, count });
    }

    const maxDailyCount = Math.max(...dailyChartData.map((d) => d.count), 1);

    return {
      totalViews,
      uniqueVisitors,
      totalSessions,
      todayViews,
      devices,
      topPages,
      topCountries,
      topReferrers,
      dailyChartData,
      maxDailyCount,
    };
  }, [filteredLogs, logs, timeRange]);

  // Relative time helper
  const formatTimeAgo = (timestampMs) => {
    const diffSec = Math.floor((Date.now() - timestampMs) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d ago`;
  };

  const exportCSV = () => {
    if (filteredLogs.length === 0) {
      Swal.fire("No data", "No visitor logs available to export.", "info");
      return;
    }

    const headers = ["Timestamp", "Date", "Path", "Page Title", "Country", "City", "Device", "Browser", "OS", "Referrer"];
    const rows = filteredLogs.map((l) => [
      new Date(l.timestampMs).toISOString(),
      new Date(l.timestampMs).toLocaleDateString(),
      `"${l.path || '/'}"`,
      `"${(l.pageTitle || '').replace(/"/g, '""')}"`,
      `"${l.country || 'Unknown'}"`,
      `"${l.city || 'Unknown'}"`,
      l.device || "Desktop",
      l.browser || "Unknown",
      l.os || "Unknown",
      `"${l.referrer || 'Direct'}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `portfolio_analytics_${timeRange}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Visitor & Traffic Analytics
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Tracking
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            Realtime in-house user analytics & Google Analytics integration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Filter */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            {[
              { key: "today", label: "Today" },
              { key: "7d", label: "7 Days" },
              { key: "30d", label: "30 Days" },
              { key: "all", label: "All Time" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTimeRange(tab.key)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeRange === tab.key
                    ? "bg-[#6366f1] text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchAnalytics}
            disabled={isRefreshing}
            className="p-2 bg-white/5 hover:bg-white/10 text-indigo-300 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 text-xs font-medium"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#6366f1]" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl border border-indigo-500/30 transition-all text-xs font-medium flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Page Views */}
        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 rounded-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Eye className="w-16 h-16 text-indigo-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">Total Page Views</span>
              <h3 className="text-2xl font-bold text-white mt-0.5">{stats.totalViews}</h3>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
            <span>Range: {timeRange.toUpperCase()}</span>
            <span className="text-indigo-400 font-medium">{stats.totalSessions} Sessions</span>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 rounded-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-purple-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">Unique Visitors</span>
              <h3 className="text-2xl font-bold text-white mt-0.5">{stats.uniqueVisitors}</h3>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
            <span>Distinct Devices</span>
            <span className="text-purple-400 font-medium">
              {stats.totalViews > 0 ? ((stats.uniqueVisitors / stats.totalViews) * 100).toFixed(0) : 0}% Ratio
            </span>
          </div>
        </div>

        {/* Today Views */}
        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 rounded-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-emerald-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">Views Today</span>
              <h3 className="text-2xl font-bold text-white mt-0.5">{stats.todayViews}</h3>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
            <span>Since 00:00 AM</span>
            <span className="text-emerald-400 font-medium">Live Counter</span>
          </div>
        </div>

        {/* Top Device */}
        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 rounded-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Smartphone className="w-16 h-16 text-amber-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">Device Split</span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {stats.devices.Mobile >= stats.devices.Desktop ? "Mobile" : "Desktop"} Lead
              </h3>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
            <span>📱 {stats.devices.Mobile} Mobile</span>
            <span>💻 {stats.devices.Desktop} PC</span>
          </div>
        </div>
      </div>

      {/* Visual Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Views Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-base text-white">Daily Traffic Trend</h3>
            </div>
            <span className="text-xs text-gray-400">Past {stats.dailyChartData.length} Days</span>
          </div>

          {/* Chart Display */}
          <div className="h-56 flex items-end gap-2 sm:gap-4 pt-6 px-2 border-b border-white/10">
            {stats.dailyChartData.map((item, idx) => {
              const heightPercent = stats.maxDailyCount > 0 ? (item.count / stats.maxDailyCount) * 100 : 0;
              const isLatest = idx === stats.dailyChartData.length - 1;
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/20 text-white text-[10px] px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap z-20">
                    <span className="font-bold text-indigo-300">{item.count} views</span> • {item.label}
                  </div>

                  {/* Count Label on top of bar */}
                  {item.count > 0 && (
                    <span className="text-[10px] text-gray-400 font-mono mb-1.5 opacity-80 group-hover:opacity-100">
                      {item.count}
                    </span>
                  )}

                  {/* Bar */}
                  <div className="w-full max-w-[36px] bg-white/5 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      style={{ height: `${Math.max(heightPercent, 4)}%` }}
                      className={`w-full transition-all duration-500 rounded-t-lg ${
                        isLatest
                          ? "bg-gradient-to-t from-indigo-600 to-purple-500 shadow-lg shadow-indigo-500/30"
                          : "bg-gradient-to-t from-indigo-500/50 to-indigo-400/80 group-hover:from-indigo-500 group-hover:to-purple-400"
                      }`}
                    />
                  </div>

                  {/* Date Label */}
                  <span className="text-[10px] text-gray-400 mt-2 font-medium truncate w-full text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-2">
            <span>Peak: <strong className="text-white">{stats.maxDailyCount} views</strong> in 1 day</span>
            <span className="text-indigo-400">Hover bars to view exact count</span>
          </div>
        </div>

        {/* Device & Location Summary (1 col) */}
        <div className="space-y-6">
          {/* Top Pages */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className="font-semibold text-sm text-white">Top Visited Pages</h3>
            </div>

            {stats.topPages.length === 0 ? (
              <p className="text-xs text-gray-500 py-3">No page views recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.topPages.map((item, idx) => {
                  const percentage = stats.totalViews > 0 ? ((item.count / stats.totalViews) * 100).toFixed(0) : 0;
                  return (
                    <div key={item.path} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-200 truncate max-w-[170px]" title={item.path}>
                          {item.path === "/" ? "Homepage (/)" : item.path}
                        </span>
                        <span className="text-gray-400 text-[11px] font-mono">
                          {item.count} views ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Countries */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-sm text-white">Top Locations</h3>
            </div>

            {stats.topCountries.length === 0 ? (
              <p className="text-xs text-gray-500 py-3">No visitor location data yet.</p>
            ) : (
              <div className="space-y-2.5">
                {stats.topCountries.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <span className="font-medium text-gray-200">{c.name}</span>
                    <span className="text-emerald-400 font-mono font-medium">{c.count} visits</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Realtime Live Visitor Log Table */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-semibold text-base text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Recent Live Visitor Activity
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">
              Showing {searchFilteredLogs.slice(0, 30).length} of {filteredLogs.length} logged visits
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by path, country, device..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white/10 rounded-xl text-xs border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white/[0.03] text-gray-400 font-medium border-b border-white/10 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Page / Path</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Device & Browser</th>
                <th className="py-3 px-4">Referrer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {searchFilteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No visitor logs recorded yet. Visit your portfolio website to see live data appear here!
                  </td>
                </tr>
              ) : (
                searchFilteredLogs.slice(0, 30).map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-indigo-400 font-medium">{formatTimeAgo(log.timestampMs)}</span>
                      <span className="block text-[10px] text-gray-500">
                        {new Date(log.timestampMs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate">
                      <span className="font-medium text-white block truncate" title={log.path}>
                        {log.path || "/"}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate block">
                        {log.pageTitle || "Portfolio"}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{log.flag || "🌐"}</span>
                        <span>{log.city && log.city !== "Unknown" ? `${log.city}, ` : ""}{log.country || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-[11px] border border-white/10 mr-1.5">
                        {log.device === "Mobile" ? "📱 Mobile" : log.device === "Tablet" ? "📟 Tablet" : "💻 PC"}
                      </span>
                      <span className="text-gray-400 text-[11px]">{log.browser || "Browser"} • {log.os || "OS"}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-gray-400 text-[11px]">
                      {log.referrer || "Direct"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
