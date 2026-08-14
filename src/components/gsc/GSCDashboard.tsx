import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import GSCTopBar from './GSCTopBar';
import GSCSidebar from './GSCSidebar';
import GSCPerformanceCard from './GSCPerformanceCard';
import GSCTableBreakdown from './GSCTableBreakdown';
import GSCServicesSection from './GSCServicesSection';
import initialGSCData from '../../data/gsc_telemetry.json';
import { FaCheckCircle, FaChartBar, FaSyncAlt } from 'react-icons/fa';
import './GSCLayout.css';

const GSCDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 992 : false
  );
  const [selectedDomain, setSelectedDomain] = useState('sc-domain:koneacademy.io');
  const [telemetryData, setTelemetryData] = useState(initialGSCData);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  // Firestore Real-Time Listener for Single Aggregated Document (1 Read per visitor session)
  useEffect(() => {
    if (
      navigator.userAgent.includes('ReactSnap') || 
      !import.meta.env.VITE_FIREBASE_API_KEY || 
      import.meta.env.VITE_FIREBASE_API_KEY === 'dummy_key' ||
      !db || !db.app
    ) {
      return;
    }

    try {
      const statsDocRef = doc(db, 'dashboard_data', 'global_stats');
      const unsubscribe = onSnapshot(statsDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.payload) {
            try {
              const parsed = typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload;
              setTelemetryData(parsed);
              setIsLiveSynced(true);
            } catch (e) {
              console.log("Telemetry hydration error", e);
            }
          }
        }
      }, (err) => {
        // Gracefully keep pre-bundled GSC data if firestore rules prevent read
        console.log("Firestore telemetry initialized with bundled snapshot");
      });

      return () => unsubscribe();
    } catch (e) {
      console.log("Firestore init skipped", e);
    }
  }, []);

  // Filter queries and pages if a specific subdomain is selected
  const isSpecificDomain = selectedDomain !== 'sc-domain:koneacademy.io';
  
  const displayedPages = isSpecificDomain 
    ? telemetryData.pages.filter(p => p.page.includes(selectedDomain))
    : telemetryData.pages;

  const displayedSummary = isSpecificDomain
    ? {
        totalClicks: displayedPages.reduce((acc, p) => acc + p.clicks, 0),
        totalImpressions: displayedPages.reduce((acc, p) => acc + p.impressions, 0),
        avgCtr: displayedPages.reduce((acc, p) => acc + p.impressions, 0) > 0 
          ? +((displayedPages.reduce((acc, p) => acc + p.clicks, 0) / displayedPages.reduce((acc, p) => acc + p.impressions, 0)) * 100).toFixed(2) 
          : 0,
        avgPosition: displayedPages.length > 0 
          ? +(displayedPages.reduce((acc, p) => acc + p.position, 0) / displayedPages.length).toFixed(1) 
          : 0
      }
    : telemetryData.summary;

  return (
    <div className="gsc-app-container">
      {/* 1. Left Sidebar */}
      <GSCSidebar 
        collapsed={sidebarCollapsed} 
        onClose={() => setSidebarCollapsed(true)}
      />

      {/* Mobile Drawer Backdrop */}
      {!sidebarCollapsed && (
        <div 
          className="gsc-sidebar-backdrop" 
          onClick={() => setSidebarCollapsed(true)} 
        />
      )}

      {/* 2. Main Work Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <GSCTopBar 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          selectedDomain={selectedDomain}
          onSelectDomain={(dom) => setSelectedDomain(dom)}
        />

        <main className="gsc-main-content">
          {/* Header & Property Info */}
          <div className="gsc-dashboard-header">
            <div className="gsc-property-title-row">
              <div className="gsc-property-name">
                <span>{selectedDomain}</span>
                <span className="gsc-verified-pill">
                  <FaCheckCircle size={11} />
                  <span>Domain Verified</span>
                </span>
              </div>
              <div className="gsc-last-updated" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaSyncAlt size={10} color="#8ab4f8" />
                <span>Last updated: {new Date(telemetryData.lastUpdated).toLocaleDateString()} (Search Engine Telemetry)</span>
              </div>
            </div>
          </div>

          {/* 3. Interactive Performance Card (Clicks, Impressions, CTR, Position + Chart) */}
          <GSCPerformanceCard 
            summary={displayedSummary}
            timeline={telemetryData.timeline}
            dateRange={telemetryData.dateRange}
          />

          {/* 4. Table Breakdown (Queries, Pages, Subdomains) */}
          <GSCTableBreakdown 
            queries={telemetryData.queries}
            pages={displayedPages}
            subdomains={telemetryData.subdomains}
          />

          {/* 5. Consulting Solutions & Conversion Hub */}
          <GSCServicesSection />
        </main>
      </div>
    </div>
  );
};

export default GSCDashboard;
