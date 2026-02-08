import React from "react";
import { learningResources } from "../data/learningResources.js";
import "../styles/main.css";

const LearningPanel = () => {
  React.useEffect(() => {
    console.log('[LearningPanel] Mounted');
  }, []);
  console.log('[LearningPanel] Rendering, resources:', learningResources?.length);
  // Debug: Log learningResources
  console.log('[LearningPanel] learningResources:', learningResources);
  if (!learningResources?.length) {
    return (
      <div className="learning-panel genio-style">
        <header className="learning-header genio-header">Crisis Health & Safety Resources</header>
        <div className="learning-list">
          <div className="learning-card genio-card">
            <h2 className="learning-title genio-title">No resources found</h2>
            <p className="learning-desc genio-desc">Check your connection or reload the page.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="learning-panel genio-style" style={{height:'100%',overflowY:'auto',padding:'16px 0 64px 0',background:'#f7f9fa'}}>
      <header className="learning-header genio-header">
        <span role="img" aria-label="Safety">🦺</span> Crisis Health & Safety Resources
        <p className="learning-subtitle">Stay safe, informed, and prepared during emergencies</p>
      </header>
      <div className="learning-list genio-list">
        {learningResources.map(resource => (
          <div className="learning-card genio-card" key={resource.id} style={{margin:'16px',borderRadius:'16px',boxShadow:'0 2px 8px #dbeafe',background:'#fff',padding:'24px'}}>
            <div className="learning-icon" style={{fontSize:'2rem',marginBottom:'8px'}}>
              {resource.category === 'flood' && '🌊'}
              {resource.category === 'safety' && '🚨'}
              {resource.category === 'storm' && '⛈️'}
              {resource.category === 'using_haven' && '🛡️'}
              {resource.category === 'other' && '💡'}
            </div>
            <h2 className="learning-title genio-title" style={{color:'#2563eb',marginBottom:'8px'}}>{resource.title}</h2>
            <p className="learning-desc genio-desc" style={{color:'#374151',marginBottom:'12px'}}>{resource.shortDescription}</p>
            <ul className="learning-bullets genio-bullets" style={{marginBottom:'12px'}}>
              {resource.bulletPoints.map((point) => (
                <li key={resource.id + '-' + point.slice(0,16)} style={{color:'#334155',fontSize:'1rem',marginBottom:'6px'}}>{point}</li>
              ))}
            </ul>
            {resource.externalLink && (
              <a className="learning-link genio-link" href={resource.externalLink} target="_blank" rel="noopener noreferrer" style={{color:'#10b981',fontWeight:'bold',textDecoration:'underline'}}>Learn more</a>
            )}
          </div>
        ))}
      </div>
      <footer className="learning-footer genio-footer" style={{marginTop:'32px',textAlign:'center',color:'#64748b'}}>
        <span role="img" aria-label="info">ℹ️</span> For urgent help, call 999 or Leeds Floodline. <br />
        <span style={{fontSize:'0.9rem'}}>Resources curated for Leeds community crisis response.</span>
      </footer>
    </div>
  );
// ...existing code...
};

export default LearningPanel;
