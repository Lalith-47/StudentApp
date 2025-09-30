import React, { useEffect, useState } from "react";
import {
  collectPerformanceMetrics,
  getMemoryUsage,
} from "../../utils/performance";

const PerformanceMonitor = ({ enabled = false }) => {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    memory: null,
    resources: null,
  });

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // First Contentful Paint
    const measureFCP = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            setMetrics((prev) => ({ ...prev, fcp: entry.startTime }));
          }
        }
      });
      observer.observe({ entryTypes: ["paint"] });
    };

    // Largest Contentful Paint
    const measureLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }));
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    };

    // First Input Delay
    const measureFID = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          setMetrics((prev) => ({
            ...prev,
            fid: entry.processingStart - entry.startTime,
          }));
        }
      });
      observer.observe({ entryTypes: ["first-input"] });
    };

    // Cumulative Layout Shift
    const measureCLS = () => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            setMetrics((prev) => ({ ...prev, cls: clsValue }));
          }
        }
      });
      observer.observe({ entryTypes: ["layout-shift"] });
    };

    // Time to First Byte
    const measureTTFB = () => {
      const navigation = performance.getEntriesByType("navigation")[0];
      if (navigation) {
        setMetrics((prev) => ({
          ...prev,
          ttfb: navigation.responseStart - navigation.requestStart,
        }));
      }
    };

    // Initialize measurements
    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();
    measureTTFB();

    // Collect additional metrics
    const collectMetrics = () => {
      const additionalMetrics = collectPerformanceMetrics();
      setMetrics((prev) => ({
        ...prev,
        memory: additionalMetrics.memory,
        resources: additionalMetrics.resources,
      }));
    };

    // Collect metrics after page load
    setTimeout(collectMetrics, 2000);

    // Cleanup
    return () => {
      // PerformanceObserver cleanup is handled automatically
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="mb-2 font-bold">Performance Metrics</div>
      <div>FCP: {metrics.fcp.toFixed(2)}ms</div>
      <div>LCP: {metrics.lcp.toFixed(2)}ms</div>
      <div>FID: {metrics.fid.toFixed(2)}ms</div>
      <div>CLS: {metrics.cls.toFixed(4)}</div>
      <div>TTFB: {metrics.ttfb.toFixed(2)}ms</div>
      {metrics.memory && (
        <>
          <div className="mt-2 pt-2 border-t border-gray-600">Memory:</div>
          <div>Used: {metrics.memory.used}MB</div>
          <div>Total: {metrics.memory.total}MB</div>
        </>
      )}
      {metrics.resources && (
        <>
          <div className="mt-2 pt-2 border-t border-gray-600">Resources:</div>
          <div>Count: {metrics.resources.total}</div>
          <div>Avg: {metrics.resources.averageLoadTime?.toFixed(2)}ms</div>
        </>
      )}
    </div>
  );
};

export default PerformanceMonitor;
