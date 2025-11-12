import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { getFileIcon } from '../../utils/fileIcons';
import './Tabs.css';

const Tabs = () => {
  const { openTabs, activeTabId, setActiveTabId, closeTab } = useEditor();

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  return (
    <div className="tabs-container">
      {openTabs.map(tab => (
        <div
          key={tab.id}
          className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
          onClick={() => setActiveTabId(tab.id)}
        >
          <span className="tab-icon" dangerouslySetInnerHTML={{ __html: getFileIcon(tab.name) }} />
          <span className="tab-label">
            {tab.name}{tab.modified ? ' •' : ''}
          </span>
          <span className="tab-close" onClick={(e) => handleCloseTab(e, tab.id)}>×</span>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
