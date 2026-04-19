import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [data, setData] = useState({
    crowdDensity: 'Medium',
    crowdDensityColor: '#F59E0B',
    waitTime: 12,
    experienceScore: 82,
    bestGate: 'Gate C',
    bestFood: 'Main Food Court (12m)',
    leastCrowdedZone: 'Zone A'
  });

  const [mapZones, setMapZones] = useState({
    A: { density: 'Low', color: '#10B981' },
    B: { density: 'Medium', color: '#F59E0B' },
    C: { density: 'High', color: '#EF4444' },
    D: { density: 'Low', color: '#10B981' }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSimulationOn, setIsSimulationOn] = useState(false);

  const [alerts, setAlerts] = useState([]);

  const addAlert = (message, type = 'warning') => {
    const id = Date.now() + Math.random();
    setAlerts(prev => [...prev, { id, message, type, isClosing: false }]);
    
    // Trigger slide out animation CSS class manually
    setTimeout(() => {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, isClosing: true } : a));
    }, 4500);

    // Hard unmount from DOM half a second later
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your Smart Stadium AI. Ask me about gates, food, or wait times.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "I'm not sure about that, but all zones are currently operational.";
      const lowerReq = userMsg.toLowerCase();
      
      if (lowerReq.includes("gate") || lowerReq.includes("crowded") || lowerReq.includes("less")) {
        aiResponse = "Based on live metrics, Gate C is currently the least crowded with an average wait time of only 2 minutes.";
      } else if (lowerReq.includes("food") || lowerReq.includes("eat") || lowerReq.includes("hungry")) {
        aiResponse = "The North Concourse food court has low density right now. The Grill stands have a minimal queue!";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        // Fetch Crowd Density
        const crowdRes = await fetch('http://127.0.0.1:8000/crowd');
        const crowdData = await crowdRes.json();
        
        const mapColors = { 'low': '#10B981', 'medium': '#F59E0B', 'high': '#EF4444' };
        
        setMapZones({
          A: { density: crowdData.A.charAt(0).toUpperCase() + crowdData.A.slice(1), color: mapColors[crowdData.A] },
          B: { density: crowdData.B.charAt(0).toUpperCase() + crowdData.B.slice(1), color: mapColors[crowdData.B] },
          C: { density: crowdData.C.charAt(0).toUpperCase() + crowdData.C.slice(1), color: mapColors[crowdData.C] },
          D: { density: crowdData.D.charAt(0).toUpperCase() + crowdData.D.slice(1), color: mapColors[crowdData.D] }
        });
        
        let overallDensity = 'Low';
        const densities = Object.values(crowdData);
        if (densities.includes('high')) overallDensity = 'High';
        else if (densities.includes('medium')) overallDensity = 'Medium';
        const overallColors = { 'Low': '#10B981', 'Medium': '#F59E0B', 'High': '#EF4444' };

        // Fetch Wait Time
        const waitRes = await fetch('http://127.0.0.1:8000/wait-time');
        const waitData = await waitRes.json();
        const stallAWait = waitData.food || 12;

        // Fetch Suggestion
        const suggRes = await fetch('http://127.0.0.1:8000/suggestion');
        const suggData = await suggRes.json();

        // Calculate Experience Score and Insights
        let score = 100;
        if (overallDensity === 'High') score -= 30;
        else if (overallDensity === 'Medium') score -= 10;
        score -= stallAWait;
        score = Math.max(0, Math.min(100, score));

        const bestFoodStr = stallAWait < 15 ? `Main Food (${stallAWait}m)` : `North Kiosk (Fast)`;
        
        const zoneEntries = Object.entries(crowdData);
        let leastZoneEntry = zoneEntries.find(z => z[1] === 'low');
        if (!leastZoneEntry) leastZoneEntry = zoneEntries.find(z => z[1] === 'medium');
        const leastCrowdedStr = leastZoneEntry ? `Zone ${leastZoneEntry[0].toUpperCase()}` : 'All Zones Busy';

        setData({
          crowdDensity: overallDensity,
          crowdDensityColor: overallColors[overallDensity],
          waitTime: stallAWait,
          experienceScore: score,
          bestGate: suggData.best_gate,
          bestFood: bestFoodStr,
          leastCrowdedZone: leastCrowdedStr
        });

        // Fetch Alerts
        const alertRes = await fetch('http://127.0.0.1:8000/alerts');
        const alertData = await alertRes.json();
        if (alertData.alerts && alertData.alerts.length > 0) {
            addAlert(alertData.alerts[0]);
        }

      } catch (err) {
        console.error("Error fetching live data from API", err);
        setError("Failed to connect to stadium feeds. Retrying...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalDuration = isSimulationOn ? 2000 : 5000;
    const interval = setInterval(fetchData, intervalDuration);

    return () => clearInterval(interval);
  }, [isSimulationOn]);

  return (
    <div className="animate-slide-up delay-1" style={{ color: 'var(--text-primary)' }}>
      
      {/* Toast Alert Container */}
      <div className="toast-container">
        {alerts.map(alert => (
          <div key={alert.id} className={`toast-alert ${alert.isClosing ? 'sliding-out' : ''}`} style={{ borderLeftColor: alert.type === 'warning' ? '#EF4444' : '#F59E0B' }}>
            <div style={{ flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={alert.type === 'warning' ? '#EF4444' : '#F59E0B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '15px' }}>Live Alert</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>{alert.message}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }} className="animate-slide-up delay-2">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 className="section-heading" style={{ fontSize: '32px', marginBottom: '0' }}>Overview Metrics</h2>
            {isLoading && <span style={{ fontSize: '15px', color: 'var(--text-secondary)', animation: 'pulse 1.5s infinite' }}>Connecting to feeds...</span>}
          </div>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '12px 16px', borderRadius: '8px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '500' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
          
          {!error && <p className="subtitle" style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Real-time aggregated stadium metrics.</p>}
        </div>

        <button 
          onClick={() => setIsSimulationOn(!isSimulationOn)}
          style={{
            background: isSimulationOn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isSimulationOn ? '#10B981' : 'rgba(255, 255, 255, 0.1)'}`,
            color: isSimulationOn ? '#10B981' : 'var(--text-secondary)',
            padding: '10px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            boxShadow: isSimulationOn ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
          }}
        >
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            background: isSimulationOn ? '#10B981' : 'rgba(255, 255, 255, 0.3)',
            boxShadow: isSimulationOn ? '0 0 8px #10B981' : 'none',
            animation: isSimulationOn ? 'pulse 1.5s infinite' : 'none'
          }}></div>
          Live Simulation {isSimulationOn ? 'ON' : 'OFF'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        
        {/* Crowd Density Card */}
        <div className="glass-panel animate-slide-up delay-2" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Crowd Density</h3>
            <div style={{ color: data.crowdDensityColor, background: `${data.crowdDensityColor}15`, padding: '8px', borderRadius: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div style={{ fontSize: '42px', fontWeight: '800', marginBottom: '8px', color: data.crowdDensityColor }}>{data.crowdDensity}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: data.crowdDensityColor, boxShadow: `0 0 10px ${data.crowdDensityColor}` }}></span>
            Live crowd pressure updating
          </div>
        </div>

        {/* Wait Time Card */}
        <div className="glass-panel animate-slide-up delay-3" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Wait Time</h3>
            <div style={{ color: '#A5B4FC', background: 'rgba(165, 180, 252, 0.1)', padding: '8px', borderRadius: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div style={{ fontSize: '42px', fontWeight: '800', marginBottom: '8px' }}>{data.waitTime} <span style={{ fontSize: '20px', color: 'var(--text-secondary)', fontWeight: '500' }}>min</span></div>
          <div style={{ color: '#10B981', fontSize: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }}></span>
            Estimated clearance
          </div>
        </div>

        {/* Experience Score Card */}
        <div className="glass-panel animate-slide-up delay-4" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Experience Score</h3>
            <div style={{ color: data.experienceScore > 75 ? '#10B981' : data.experienceScore > 50 ? '#F59E0B' : '#EF4444', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <div style={{ fontSize: '42px', fontWeight: '800', marginBottom: '8px', color: data.experienceScore > 75 ? '#10B981' : data.experienceScore > 50 ? '#F59E0B' : '#EF4444' }}>
            {data.experienceScore} <span style={{ fontSize: '20px', opacity: 0.7, fontWeight: '500' }}>/100</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
             Dynamic real-time rating
          </div>
        </div>

      </div>

      {/* AI Recommendation Section */}
      <div className="glass-panel animate-slide-up delay-5" style={{ padding: '32px', marginTop: '32px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(20, 20, 25, 0.8) 100%)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', padding: '16px', borderRadius: '16px', color: '#FFF', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a8 8 0 0 0-8 8v12h16V10a8 8 0 0 0-8-8z"/><path d="M8 22v-4"/><path d="M16 22v-4"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              AI Smart Recommendation 
              <span style={{fontSize: '11px', background: 'rgba(99, 102, 241, 0.2)', color: '#A5B4FC', border: '1px solid rgba(165, 180, 252, 0.3)', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', letterSpacing: '1px'}}>LIVE INSIGHT</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A5B4FC" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                   Best Gate
                 </div>
                 <div style={{ fontSize: '22px', fontWeight: '600', color: '#FFF' }}>{data.bestGate}</div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                   Optimal Food
                 </div>
                 <div style={{ fontSize: '22px', fontWeight: '600', color: '#FFF' }}>{data.bestFood}</div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                   Least Crowded
                 </div>
                 <div style={{ fontSize: '22px', fontWeight: '600', color: '#10B981' }}>{data.leastCrowdedZone}</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Bottom Section: Map + Chatbot */}
      <div style={{ marginTop: '56px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Map Column */}
        <div className="animate-slide-in-left delay-4" style={{ flex: '1.5', minWidth: '400px' }}>
          <h2 className="section-heading">Live Stadium Map</h2>
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexWrap: 'wrap', gap: '32px', height: '100%', minHeight: '400px' }}>
            
            {/* Map Representation */}
            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px', 
                background: 'rgba(255,255,255,0.02)', 
                padding: '24px', 
                borderRadius: '24px',
                border: '2px dashed rgba(255,255,255,0.1)',
                height: '100%'
              }}>
                {['A', 'B', 'C', 'D'].map(zone => (
                  <div key={zone} style={{
                    background: `${mapZones[zone].color}15`,
                    border: `2px solid ${mapZones[zone].color}`,
                    borderRadius: '16px',
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.5s ease',
                    boxShadow: `0 0 20px ${mapZones[zone].color}30 inset`
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Zone {zone}</div>
                    <div style={{ color: mapZones[zone].color, fontWeight: '600', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>
                      {mapZones[zone].density}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ width: '200px', display: 'flex', flexDirection: 'column', justifySelf: 'center', margin: 'auto 0' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '24px', color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Density Legend</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#10B981', boxShadow: '0 0 12px #10B981' }}></div>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Low (Optimal)</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#F59E0B', boxShadow: '0 0 12px #F59E0B' }}></div>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Medium (Monitor)</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#EF4444', boxShadow: '0 0 12px #EF4444' }}></div>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>High (Action Req.)</span>
              </div>
              
            </div>
          </div>
        </div>

        {/* AI Chatbot Column */}
        <div className="animate-slide-in-right delay-4" style={{ flex: '1', minWidth: '350px', display: 'flex', flexDirection: 'column' }}>
          <h2 className="section-heading">AI Assistant</h2>
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '400px', overflow: 'hidden' }}>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', padding: '24px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                  background: msg.role === 'user' ? '#6366F1' : 'rgba(255,255,255,0.05)', 
                  border: msg.role !== 'user' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  padding: '14px 18px', 
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', 
                  maxWidth: '85%', 
                  fontSize: '15px',
                  lineHeight: '1.5'
                }}>
                   {msg.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ 
                  alignSelf: 'flex-start', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '14px 18px', 
                  borderRadius: '16px 16px 16px 4px', 
                  fontSize: '15px' 
                }}>
                  <span style={{ animation: 'pulse 1.5s infinite' }}>AI is typing...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <input 
                type="text" 
                value={inputValue} 
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask about gates or food..." 
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#FFF', outline: 'none', fontSize: '15px', transition: 'border-color 0.2s' }} 
                onFocus={e => e.target.style.borderColor = '#6366F1'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button type="submit" style={{ background: '#6366F1', color: '#FFF', border: 'none', borderRadius: '12px', padding: '0 24px', fontWeight: '600', cursor: 'pointer', fontSize: '15px', transition: 'background 0.2s' }}
                onMouseEnter={e => e.target.style.background = '#4F46E5'}
                onMouseLeave={e => e.target.style.background = '#6366F1'}
              >
                Send
              </button>
            </form>
            
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
