import React from "react";
import { learningResources } from "../data/learningResources";
import "../styles/main.css";

const LearningPanel = () => (
  <div className="learning-panel">
    <header className="learning-header">Important Info</header>
    <div className="learning-list">
      {learningResources.map(resource => (
        <div className="learning-card" key={resource.id}>
          <h2 className="learning-title">{resource.title}</h2>
          <p className="learning-desc">{resource.shortDescription}</p>
          <ul className="learning-bullets">
            {resource.bulletPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
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

export default LearningPanel;
