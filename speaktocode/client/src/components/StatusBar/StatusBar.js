import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { useVoice } from '../../context/VoiceContext';
import './StatusBar.css';

const StatusBar = () => {
  const { openTabs, activeTabId } = useEditor();
  const { isListening } = useVoice();
  
  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-file">
          {activeTab ? activeTab.name : 'No file open'}
        </span>
        <span className="status-position">Ln 1, Col 1</span>
        <span className="status-language">
          {activeTab ? activeTab.language : 'Plain Text'}
        </span>
      </div>
      <div className="status-right">
        <span className={`voice-status ${isListening ? 'listening' : ''}`}>
          🎤 Voice: {isListening ? 'Listening' : 'Off'}
        </span>
        <span>UTF-8</span>
        <span>LF</span>
      </div>
    </div>
  );
};

export default StatusBar;
