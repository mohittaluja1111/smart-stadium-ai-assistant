import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

const Map = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMapData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/map');
      const data = await response.json();
      setPoints(data.points);
    } catch (error) {
      console.error('Failed to fetch map data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
    const interval = setInterval(fetchMapData, 3000); // Live updates every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Live Intelligence Map</h1>
          <p className="subtitle">Real-time crowd heatmapping and congestion visualization.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></span> High Density
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></span> Medium Density
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></span> Low Density
          </span>
        </div>
      </div>

      <div className="glass-panel" style={{ 
        position: 'relative', 
        height: '600px', 
        width: '100%', 
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #13141a, #0a0a0b)',
        border: '1px solid var(--glass-border)'
      }}>
        {/* Stadium Shape Simulation */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '70%',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          background: 'rgba(255,255,255,0.02)'
        }}></div>

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '30%',
          height: '40%',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          background: '#4CAF50',
          opacity: 0.1
        }}></div>

        {/* Map Points */}
        {!loading && points.map(point => {
          const color = point.density === 'High' ? '#EF4444' : point.density === 'Medium' ? '#F59E0B' : '#10B981';
          return (
            <div
              key={point.id}
              style={{
                position: 'absolute',
                top: `${point.y}%`,
                left: `${point.x}%`,
                transform: 'translate(-50%, -50%)',
                color: color,
                transition: 'all 1s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 10
              }}
              title={`Zone: ${point.zone} | Density: ${point.density}`}
            >
              <div style={{
                position: 'absolute',
                width: '30px',
                height: '30px',
                background: color,
                opacity: 0.2,
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              <MapPin size={24} style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.8))' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Map;
