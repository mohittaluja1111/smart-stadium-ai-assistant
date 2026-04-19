import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hi! I'm your Smart Stadium AI. Ask me about food wait times, parking availability, gate entry, or directions." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Connection error. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <h1>AI Assistant</h1>
      <p className="subtitle">Real-time answers to optimize your stadium experience.</p>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '12px',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              maxWidth: '80%'
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: msg.role === 'user' ? 'var(--accent-color)' : 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} color="var(--accent-color)" />}
              </div>
              <div style={{
                padding: '16px',
                borderRadius: '16px',
                background: msg.role === 'user' ? 'var(--accent-color)' : 'var(--glass-bg)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--glass-border)',
                lineHeight: '1.5'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="var(--accent-color)" />
              </div>
              <div style={{ padding: '16px', borderRadius: '16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <div className="typing-indicator" style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite' }}></span>
                  <span style={{ width: '8px', height: '8px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}></span>
                  <span style={{ width: '8px', height: '8px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about food, gates, or parking..." 
              style={{
                flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '16px', outline: 'none'
              }}
            />
            <button 
              onClick={handleSend}
              style={{
                padding: '0 24px', borderRadius: '12px', background: 'var(--accent-color)', color: 'white',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                fontWeight: '600', transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--accent-color)'}
            >
              <Send size={20} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
