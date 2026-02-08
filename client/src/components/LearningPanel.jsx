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
  if (!learningResources) {
    console.log('[LearningPanel] learningResources is undefined or null!');
  } else if (!learningResources.length) {
    console.log('[LearningPanel] learningResources is empty array!');
  }
  if (!learningResources?.length) {
    return (
      <div className="learning-panel">
        <header className="learning-header">Important Info</header>
        <div className="learning-list">
          <div className="learning-card">
            <h2 className="learning-title">No learning resources found</h2>
            <p className="learning-desc">Please check your connection or reload the page.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="learning-panel" style={{height:'100%',overflowY:'auto',padding:'16px 0 64px 0',background:'#fff'}}>
      <header className="learning-header">Important Info</header>
      <div className="learning-list">
        {learningResources.map(resource => (
          <div className="learning-card" key={resource.id}>
            <h2 className="learning-title">{resource.title}</h2>
            <p className="learning-desc">{resource.shortDescription}</p>
            <ul className="learning-bullets">
              {resource.bulletPoints.map((point) => (
                <li key={resource.id + '-' + point.slice(0,16)}>{point}</li>
              ))}
            </ul>
            {resource.externalLink && (
              <a
                className="learning-link"
                href={resource.externalLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                More info
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPanel;
