import React, { useState } from 'react';
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa';

interface QueryItem {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface PageItem {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SubdomainItem {
  domain: string;
  clicks: number;
  impressions: number;
  ctr: number;
}

interface GSCTableBreakdownProps {
  queries: QueryItem[];
  pages: PageItem[];
  subdomains: SubdomainItem[];
}

const GSCTableBreakdown: React.FC<GSCTableBreakdownProps> = ({
  queries,
  pages,
  subdomains
}) => {
  const [activeTab, setActiveTab] = useState<'queries' | 'pages' | 'subdomains'>('queries');
  const [searchFilter, setSearchFilter] = useState('');

  // Calculate max impressions for relative progress bars
  const maxQueryImpressions = Math.max(...queries.map(q => q.impressions), 1);
  const maxPageImpressions = Math.max(...pages.map(p => p.impressions), 1);
  const maxSubdomainImpressions = Math.max(...subdomains.map(s => s.impressions), 1);

  const filteredQueries = queries.filter(q => 
    q.query.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredPages = pages.filter(p => 
    p.page.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredSubdomains = subdomains.filter(s => 
    s.domain.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="gsc-card">
      {/* Tabs */}
      <div className="gsc-table-tabs">
        <button 
          className={`gsc-table-tab ${activeTab === 'queries' ? 'active' : ''}`}
          onClick={() => { setActiveTab('queries'); setSearchFilter(''); }}
        >
          QUERIES ({queries.length})
        </button>
        <button 
          className={`gsc-table-tab ${activeTab === 'pages' ? 'active' : ''}`}
          onClick={() => { setActiveTab('pages'); setSearchFilter(''); }}
        >
          PAGES ({pages.length})
        </button>
        <button 
          className={`gsc-table-tab ${activeTab === 'subdomains' ? 'active' : ''}`}
          onClick={() => { setActiveTab('subdomains'); setSearchFilter(''); }}
        >
          SUBDOMAINS ({subdomains.length})
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ padding: '12px 1.5rem', borderBottom: '1px solid #3c4043', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FaSearch color="#9aa0a6" size={14} />
        <input 
          type="text"
          placeholder={`Filter ${activeTab}...`}
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#e8eaed',
            fontSize: '0.85rem',
            width: '100%',
            outline: 'none'
          }}
        />
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        {activeTab === 'queries' && (
          <table className="gsc-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Top Queries</th>
                <th style={{ width: '15%' }}>Clicks</th>
                <th style={{ width: '25%' }}>Impressions</th>
                <th style={{ width: '15%' }}>CTR</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{item.query}</td>
                  <td><span style={{ color: '#8ab4f8', fontWeight: 600 }}>{item.clicks}</span></td>
                  <td>
                    <div className="gsc-table-bar-cell">
                      <span>{item.impressions}</span>
                      <div 
                        className="gsc-table-bar" 
                        style={{ width: `${Math.min(100, (item.impressions / maxQueryImpressions) * 120)}px` }} 
                      />
                    </div>
                  </td>
                  <td>{item.ctr}%</td>
                </tr>
              ))}
              {filteredQueries.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: '#9aa0a6', padding: '2rem' }}>
                    No search queries found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'pages' && (
          <table className="gsc-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Top Pages</th>
                <th style={{ width: '15%' }}>Clicks</th>
                <th style={{ width: '20%' }}>Impressions</th>
                <th style={{ width: '15%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ wordBreak: 'break-all', color: '#8ab4f8' }}>{item.page}</td>
                  <td><span style={{ color: '#8ab4f8', fontWeight: 600 }}>{item.clicks}</span></td>
                  <td>
                    <div className="gsc-table-bar-cell">
                      <span>{item.impressions}</span>
                      <div 
                        className="gsc-table-bar" 
                        style={{ width: `${Math.min(100, (item.impressions / maxPageImpressions) * 120)}px` }} 
                      />
                    </div>
                  </td>
                  <td>
                    <a 
                      href={item.page} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#9aa0a6', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.8rem' }}
                    >
                      <span>Visit</span>
                      <FaExternalLinkAlt size={10} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'subdomains' && (
          <table className="gsc-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Ecosystem Subdomain</th>
                <th style={{ width: '15%' }}>Total Clicks</th>
                <th style={{ width: '25%' }}>Total Impressions</th>
                <th style={{ width: '15%' }}>CTR</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubdomains.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{item.domain}</td>
                  <td><span style={{ color: '#8ab4f8', fontWeight: 600 }}>{item.clicks}</span></td>
                  <td>
                    <div className="gsc-table-bar-cell">
                      <span>{item.impressions}</span>
                      <div 
                        className="gsc-table-bar" 
                        style={{ width: `${Math.min(100, (item.impressions / maxSubdomainImpressions) * 120)}px` }} 
                      />
                    </div>
                  </td>
                  <td>{item.ctr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GSCTableBreakdown;
