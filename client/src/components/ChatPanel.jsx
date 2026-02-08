import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const WS_URL = window.location.hostname === 'localhost'
  ? 'ws://localhost:3001/chat'
  : 'wss://affectionate-flexibility-production.up.railway.app/chat';

const ChatPanel = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    ws.current = new window.WebSocket(WS_URL);
    ws.current.onopen = () => {
      console.log('[ChatPanel] WebSocket connected');
    };
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };
    ws.current.onclose = () => {
      console.log('[ChatPanel] WebSocket disconnected');
    };
    return () => {
      ws.current && ws.current.close();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = { user: 'Anonymous', text: input.trim(), time: new Date().toLocaleTimeString() };
    ws.current.send(JSON.stringify(msg));
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  return (
    <div className="chat-panel" style={{background:'#fff',padding:'16px',height:'100%',display:'flex',flexDirection:'column'}}>
      <header className="chat-header" style={{fontWeight:'bold',fontSize:'1.2rem',marginBottom:'8px'}}>Local Chat</header>
      <div className="chat-messages" style={{flex:1,overflowY:'auto',marginBottom:'8px',background:'#f3f4f6',borderRadius:'8px',padding:'8px'}}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{marginBottom:'6px'}}>
            <span style={{fontWeight:'bold',color:'#2563eb'}}>{msg.user}:</span> <span style={{color:'#222'}}>{msg.text}</span>
            <span style={{float:'right',fontSize:'0.8rem',color:'#64748b'}}>{msg.time}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{display:'flex'}}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{flex:1,padding:'8px',borderRadius:'8px',border:'1px solid #dbeafe'}}
        />
        <button type="submit" style={{marginLeft:'8px',padding:'8px 16px',borderRadius:'8px',background:'#2563eb',color:'#fff',border:'none'}}>Send</button>
      </form>
    </div>
  );
};

ChatPanel.propTypes = {};

export default ChatPanel;
