import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';

interface TimelinePoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface PerformanceSummary {
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
}

interface GSCPerformanceCardProps {
  summary: PerformanceSummary;
  timeline: TimelinePoint[];
  dateRange: string;
}

const GSCPerformanceCard: React.FC<GSCPerformanceCardProps> = ({
  summary,
  timeline,
  dateRange
}) => {
  const [activeMetrics, setActiveMetrics] = useState({
    clicks: true,
    impressions: true,
    ctr: false,
    position: false
  });

  const toggleMetric = (key: 'clicks' | 'impressions' | 'ctr' | 'position') => {
    setActiveMetrics(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Format date for chart axis (e.g. '07-15' -> 'Jul 15')
  const formattedTimeline = timeline.map(point => {
    const parts = point.date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
    return {
      ...point,
      displayDate: `${month} ${parts[2]}`
    };
  });

  return (
    <div className="gsc-card" id="performance-section">
      <div className="gsc-card-header">
        <div>
          <h2 className="gsc-card-title">Performance on Search Results</h2>
          <span style={{ fontSize: '0.8rem', color: '#9aa0a6' }}>Date range: {dateRange} (Full Ecosystem Telemetry)</span>
        </div>
      </div>

      {/* 4 Top Metric Cards (Pills with toggle checkboxes) */}
      <div className="gsc-metrics-grid">
        {/* 1. Total Clicks */}
        <div 
          className={`gsc-metric-cell clicks ${activeMetrics.clicks ? 'active' : ''}`}
          onClick={() => toggleMetric('clicks')}
        >
          <div className="gsc-metric-checkbox-row">
            {activeMetrics.clicks ? <FaCheckSquare color="#8ab4f8" /> : <FaSquare color="#5f6368" />}
            <span>Total clicks</span>
          </div>
          <div className="gsc-metric-value">{summary.totalClicks.toLocaleString()}</div>
        </div>

        {/* 2. Total Impressions */}
        <div 
          className={`gsc-metric-cell impressions ${activeMetrics.impressions ? 'active' : ''}`}
          onClick={() => toggleMetric('impressions')}
        >
          <div className="gsc-metric-checkbox-row">
            {activeMetrics.impressions ? <FaCheckSquare color="#c58af9" /> : <FaSquare color="#5f6368" />}
            <span>Total impressions</span>
          </div>
          <div className="gsc-metric-value">{summary.totalImpressions.toLocaleString()}</div>
        </div>

        {/* 3. Average CTR */}
        <div 
          className={`gsc-metric-cell ctr ${activeMetrics.ctr ? 'active' : ''}`}
          onClick={() => toggleMetric('ctr')}
        >
          <div className="gsc-metric-checkbox-row">
            {activeMetrics.ctr ? <FaCheckSquare color="#81c995" /> : <FaSquare color="#5f6368" />}
            <span>Average CTR</span>
          </div>
          <div className="gsc-metric-value">{summary.avgCtr}%</div>
        </div>

        {/* 4. Average Position */}
        <div 
          className={`gsc-metric-cell position ${activeMetrics.position ? 'active' : ''}`}
          onClick={() => toggleMetric('position')}
        >
          <div className="gsc-metric-checkbox-row">
            {activeMetrics.position ? <FaCheckSquare color="#fdd663" /> : <FaSquare color="#5f6368" />}
            <span>Average position</span>
          </div>
          <div className="gsc-metric-value">{summary.avgPosition}</div>
        </div>
      </div>

      {/* Interactive Timeline Chart */}
      <div className="gsc-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedTimeline} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
            <XAxis 
              dataKey="displayDate" 
              stroke="#9aa0a6" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#3c4043' }} 
              interval="preserveStartEnd"
              minTickGap={20}
            />
            <YAxis 
              yAxisId="left"
              stroke="#9aa0a6" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#3c4043' }} 
            />
            {activeMetrics.position && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                reversed={true}
                stroke="#fdd663" 
                fontSize={12} 
                tickLine={false} 
                axisLine={{ stroke: '#3c4043' }} 
              />
            )}
            <RechartsTooltip 
              contentStyle={{
                backgroundColor: '#28292a',
                borderColor: '#3c4043',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.85rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ padding: '2px 0' }}
            />
            <Legend verticalAlign="top" height={36} />

            {activeMetrics.clicks && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="clicks" 
                name="Clicks" 
                stroke="#8ab4f8" 
                strokeWidth={2.5} 
                dot={false}
                activeDot={{ r: 6 }} 
              />
            )}

            {activeMetrics.impressions && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="impressions" 
                name="Impressions" 
                stroke="#c58af9" 
                strokeWidth={2.5} 
                dot={false}
                activeDot={{ r: 6 }} 
              />
            )}

            {activeMetrics.ctr && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="ctr" 
                name="CTR (%)" 
                stroke="#81c995" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}

            {activeMetrics.position && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="position" 
                name="Avg. Position" 
                stroke="#fdd663" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GSCPerformanceCard;
